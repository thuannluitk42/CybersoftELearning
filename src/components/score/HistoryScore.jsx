import React, { useEffect, useMemo, useState } from 'react';
import { useTable, usePagination } from 'react-table';
import ReactPaginate from 'react-paginate';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUser } from '../../utils/UserContext';
import { fetchScoreByUsername } from "../../utils/QuizService";

const TableComponent = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    gotoPage,
    pageCount,
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    usePagination
  );

  const handlePageClick = ({ selected }) => {
    gotoPage(selected);
  };

  return (
    <>
      <table {...getTableProps()} className="table table-striped">
        <thead>
          {headerGroups.map((headerGroup, i) => (
            <tr key={i} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column, j) => (
                <th key={j} {...column.getHeaderProps()}>{column.render('Header')}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr key={i} {...row.getRowProps()}>
                {row.cells.map((cell, j) => (
                  <td key={j} {...cell.getCellProps()}>{cell.render('Cell')}</td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      {pageCount > 0 && (
        <div className="pagination">
          <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            breakLabel={'...'}
            breakClassName={'break-me'}
            pageCount={pageCount}
            marginPagesDisplayed={2}
            pageRangeDisplayed={5}
            onPageChange={handlePageClick}
            containerClassName={'pagination'}
            activeClassName={'active'}
          />
        </div>
      )}
    </>
  );
};

const HistoryScore = () => {
  const { user } = useUser();
  const [scores, setScores] = useState([]);
  const columns = useMemo(
    () => [
      {
        Header: 'Username',
        accessor: 'userName',
      },
      {
        Header: 'Quiz Subjects',
        accessor: 'quizSubjects',
      },
      {
        Header: 'Score',
        accessor: 'totalScore',
      },
      {
        Header: 'Completed At',
        accessor: 'completeAt',
      },
    ],
    []
  );

  useEffect(() => {
    fetchScoreForUser();
  }, []);

  const fetchScoreForUser = async () => {
    try {
      const userName = user.username;
      const response = await fetchScoreByUsername(userName);
      setScores(response);
    } catch (error) {
      console.error(error);
    }
  };

  const data = useMemo(() => scores, [scores]);

  return (
    <div className="container mt-5">
      <h1 className="mb-4">Quiz History Tracking</h1>
      {scores.length === 0 ? (
        <p>The leaderboard has no data yet.</p>
      ) : (
        <TableComponent columns={columns} data={data} />
      )}
    </div>
  );
};

export default HistoryScore;
