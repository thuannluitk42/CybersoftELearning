import React, { useEffect, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import { fetchQuizForUser, saveAchievementsForUser } from "../../../utils/QuizService"
import AnswerOptions from "../../../utils/AnswerOptions"
import { useUser } from "../../../utils/UserContext";

const Quiz = () => {
	const [quizQuestions, setQuizQuestions] = useState([
		{ id: "", correctAnswers: "", question: "", questionType: "" }
	])
	const [selectedAnswers, setSelectedAnswers] = useState([{ id: "", answer: "" }])
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
	const [totalScores, setTotalScores] = useState(0)
	const location = useLocation()
	const navigate = useNavigate()
	const { selectedSubject, selectedNumQuestions } = location.state
	const { user, setUser } = useUser();

	useEffect(() => {
		fetchQuizData()
	}, [])

	const fetchQuizData = async () => {
		if (selectedNumQuestions && selectedSubject) {
			const questions = await fetchQuizForUser(selectedNumQuestions, selectedSubject)
			setQuizQuestions(questions)
		}
	}

	const handleAnswerChange = (questionId, answer) => {
		setSelectedAnswers((prevAnswers) => {
			const existingAnswerIndex = prevAnswers.findIndex((answerObj) => answerObj.id === questionId)
			const selectedAnswer = Array.isArray(answer)
				? answer.map((a) => a.charAt(0))
				: answer.charAt(0)

			if (existingAnswerIndex !== -1) {
				const updatedAnswers = [...prevAnswers]
				updatedAnswers[existingAnswerIndex] = { id: questionId, answer: selectedAnswer }
				console.log(updatedAnswers)
				return updatedAnswers
			} else {
				const newAnswer = { id: questionId, answer: selectedAnswer }

				return [...prevAnswers, newAnswer]
			}
		})
	}

	const isChecked = (questionId, choice) => {
		const selectedAnswer = selectedAnswers.find((answer) => answer.id === questionId)
		if (!selectedAnswer) {
			return false
		}
		if (Array.isArray(selectedAnswer.answer)) {
			return selectedAnswer.answer.includes(choice.charAt(0))
		}
		return selectedAnswer.answer === choice.charAt(0)
	}

	const handleCheckboxChange = (questionId, choice) => {
		setSelectedAnswers((prevAnswers) => {
			const existingAnswerIndex = prevAnswers.findIndex((answerObj) => answerObj.id === questionId)
			const selectedAnswer = Array.isArray(choice)
				? choice.map((c) => c.charAt(0))
				: choice.charAt(0)

			if (existingAnswerIndex !== -1) {
				const updatedAnswers = [...prevAnswers]
				const existingAnswer = updatedAnswers[existingAnswerIndex].answer
				let newAnswer
				if (Array.isArray(existingAnswer)) {
					newAnswer = existingAnswer.includes(selectedAnswer)
						? existingAnswer.filter((a) => a !== selectedAnswer)
						: [...existingAnswer, selectedAnswer]
				} else {
					newAnswer = [existingAnswer, selectedAnswer]
				}
				updatedAnswers[existingAnswerIndex] = { id: questionId, answer: newAnswer }
				console.log(updatedAnswers)
				return updatedAnswers
			} else {
				const newAnswer = { id: questionId, answer: [selectedAnswer] }
				return [...prevAnswers, newAnswer]
			}
		})
	}

	const handleSubmit = async () => {
		
		let totalScore = 0;

		const checkAnswerCorrectness = (selectedAnswer, question) => {
          const selectedOptions = Array.isArray(selectedAnswer.answer)
			? selectedAnswer.answer.map((option) => option.charAt(0))
			: [selectedAnswer.answer.charAt(0)];

          const correctOptions = Array.isArray(question.correctAnswers)
			? question.correctAnswers.map((option) => option.charAt(0))
			: [question.correctAnswers.charAt(0)];

          return selectedOptions.length === correctOptions.length &&
                 selectedOptions.every((option) => correctOptions.includes(option));
		};

		quizQuestions.forEach((question) => {
          const selectedAnswer = selectedAnswers.find((answer) => answer.id === question.id);
          if (selectedAnswer) {
			if (checkAnswerCorrectness(selectedAnswer, question)) {
              totalScore++;
			}
          }
		});

		// Set the total score and reset the state
		setTotalScores(totalScore);
		setSelectedAnswers([]);
		setCurrentQuestionIndex(0);

		try {
			const userName = user.username;
			const quizSubjects = selectedSubject;
			const param = { userName, quizSubjects, totalScore};

			const response = await saveAchievementsForUser(param);
			console.log("save achievement successful:", response);
        } catch (error) {
			console.error("save achievement failed:", error.response ? error.response.data : error.message);
        }

		// Navigate to the results page with the quiz questions and the total score
		navigate("/quiz-result", { state: { quizQuestions, totalScores: totalScore} });
      };


	const handleNextQuestion = () => {
		if (currentQuestionIndex < quizQuestions.length - 1) {
			setCurrentQuestionIndex((prevIndex) => prevIndex + 1)
			console.log(selectedAnswers)
		} else {
			handleSubmit()
		}
	}

	const handlePreviousQuestion = () => {
		if (currentQuestionIndex > 0) {
			setCurrentQuestionIndex((prevIndex) => prevIndex - 1)
		}
	}

	return (
		<div className="p-5">
			<h3 className="text-info">
				Question {quizQuestions.length > 0 ? currentQuestionIndex + 1 : 0} of {quizQuestions.length}
			</h3>

			<h4 className="mb-4">
				<pre>{quizQuestions[currentQuestionIndex]?.question}</pre>
			</h4>

			<AnswerOptions
				question={quizQuestions[currentQuestionIndex]}
				isChecked={isChecked}
				handleAnswerChange={handleAnswerChange}
				handleCheckboxChange={handleCheckboxChange}
			/>

			<div className="mt-4">
				<button
					className="btn btn-sm btn-primary me-2"
					onClick={handlePreviousQuestion}
					disabled={currentQuestionIndex === 0}>
					Previous question
				</button>
				<button
					className={`btn btn-sm btn-info ${
						currentQuestionIndex === quizQuestions.length - 1 && "btn btn-sm btn-warning"
					}`}
					onClick={handleNextQuestion}
					disabled={
						!selectedAnswers.find(
							(answer) =>
								answer.id === quizQuestions[currentQuestionIndex]?.id || answer.answer.length > 0
						)
					}>
					{currentQuestionIndex === quizQuestions.length - 1 ? "Submit quiz" : "Next question"}
				</button>
			</div>
		</div>
	)
}

export default Quiz
