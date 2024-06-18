import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../../config/firebase/firebase'; // Firebase db import
import { getDoc, doc } from 'firebase/firestore'; // Firestore 함수 import

export default function ResultPage() {
    const router = useRouter();
    const { id, score } = router.query;
    const [nickname, setNickname] = useState(''); // 닉네임 상태 추가
    const [userScores, setUserScores] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(6);

    useEffect(() => {
        const fetchUserScores = async () => {
            try {
                const quizRef = doc(db, 'users', id);
                const quizSnap = await getDoc(quizRef);
                if (quizSnap.exists()) {
                    const quizData = quizSnap.data();
                    setNickname(quizData.nickname); // 닉네임 설정
                    if (quizData.answers) {
                        setUserScores(quizData.answers);
                    }
                } else {
                    console.error('Quiz not found');
                }
            } catch (error) {
                console.error('Error fetching user scores:', error);
            }
        };

        if (id) {
            fetchUserScores();
        }
    }, [id]);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(userScores.length / itemsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    // 페이지 네비게이션을 위한 데이터 계산
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentScores = userScores.slice(indexOfFirstItem, indexOfLastItem);

    // 총 페이지 수 계산
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(userScores.length / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (
        <Container>
            <Title>{`${nickname}의 퀴즈 결과`}</Title>
            <ScoreText>나의 점수: {score}점</ScoreText>
            <ScoreTable>
                <thead>
                    <tr>
                        <TableHeader>유저 이름</TableHeader>
                        <TableHeader>점수</TableHeader>
                    </tr>
                </thead>
                <tbody>
                    {currentScores.map((user, index) => (
                        <TableRow key={index}>
                            <TableCell>{user.userName}</TableCell>
                            <TableCell>{user.score}점</TableCell>
                        </TableRow>
                    ))}
                </tbody>
            </ScoreTable>
            <PageNavigation>
                <PageButton onClick={handlePreviousPage} disabled={currentPage === 1}>
                    &lt;
                </PageButton>
                {pageNumbers.map((number) => (
                    <PageButton key={number} onClick={() => handlePageChange(number)} isActive={number === currentPage}>
                        {number}
                    </PageButton>
                ))}
                <PageButton onClick={handleNextPage} disabled={currentPage === Math.ceil(userScores.length / itemsPerPage)}>
                    &gt;
                </PageButton>
            </PageNavigation>
            <Btnbox>
                <Img onClick={() => router.push(`/quiz/${id}`)} className="btn" src="/img/group333.png"></Img>
                <Img onClick={() => router.push('/')} className="btn" src="/img/group444.png"></Img>
            </Btnbox>
        </Container>
    );
}

const Container = styled.div`
    min-height: 100vh;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    color: #402f5c; /* 텍스트 색상 */
    background-image: url('/img/group52.png'); /* 배경 이미지 */
    background-repeat: no-repeat; /* 이미지 반복 없애기 */
    background-size: 90% 90%; /* 화면 가득 차게 */
    background-repeat: no-repeat; /* 이미지 반복 없애기 */
    background-position: center center; /* 중앙에 배치 */
`;
const Title = styled.h1`
    font-size: 2rem;
    margin-bottom: 20px;
`;

const ScoreText = styled.p`
    font-size: 1.5rem;
    margin-bottom: 20px;
`;

const ScoreTable = styled.table`
    width: 30%;
    border-collapse: collapse;
    margin-bottom: 20px;
`;

const TableHeader = styled.th`
    border: 2px solid #402f5c;
    padding: 8px;
    background-color: #f2f2f2;
    text-align: center;
`;

const TableRow = styled.tr`
    &:nth-child(even) {
        background-color: #f9f9f9;
    }
`;

const TableCell = styled.td`
    border: 2px solid #402f5c;
    padding: 8px;
    text-align: center;
`;

const PageNavigation = styled.div`
    margin-top: 20px;
    display: flex;
    color: #a0522d;
    align-items: center;
`;

const PageButton = styled.div`
    margin: 0 5px;
    padding: 5px 10px;
    border: none;
    cursor: pointer;
`;

const Img = styled.img`
    &.btn {
        width: 200px;
        &:hover {
            cursor: pointer;
        }
    }
`;
const Btnbox = styled.div`
    display: flex;
`;
