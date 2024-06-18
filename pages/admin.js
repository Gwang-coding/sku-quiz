import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useRouter } from 'next/router';
import { db } from '../config/firebase/firebase'; // Firebase db import
import { collection, getDocs, doc, deleteDoc } from 'firebase/firestore'; // Firestore 함수 import

const Home = () => {
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const router = useRouter();
    const [users, setUsers] = useState([]); // 사용자 목록을 관리할 상태 추가
    const [showAdminModal, setShowAdminModal] = useState(false);
    const [filteredUsers, setFilteredUsers] = useState([]); // 필터링된 사용자 목록을 관리할 상태 추가
    const [adminPasswordInput, setAdminPasswordInput] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // 관리자 모드 상태 추가
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // 퀴즈 데이터 가져오기
    const fetchQuizzes = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, 'users'));
            const fetchedUsers = querySnapshot.docs.map((doc) => ({
                id: doc.id,
                nickname: doc.data().nickname,
                quizzes: doc.data().quizzes,
                password: doc.data().password, // 추가된 부분: 비밀번호도 가져오기
            }));
            setUsers(fetchedUsers);
            setFilteredUsers(fetchedUsers); // 필터링된 사용자 목록 초기화
        } catch (error) {
            console.error('Error fetching quizzes: ', error);
        }
    };

    useEffect(() => {
        fetchQuizzes();
    }, []); // 컴포넌트가 마운트될 때 한 번만 실행

    useEffect(() => {
        if (router.pathname === '/admin') {
            setShowAdminModal(true);
        }
    }, [router.pathname]);

    useEffect(() => {
        handleSearch();
    }, [search]); // 검색어가 변경될 때마다 필터링

    const handleSearch = () => {
        const filtered = users.filter((user) => user.nickname.toLowerCase().includes(search.toLowerCase()));
        setFilteredUsers(filtered);
        setPage(1); // 검색할 때 페이지를 처음으로 리셋
    };

    const handleQuizClick = (id) => {
        router.push(`/quiz/${id}`);
    };

    const handleCreate = () => {
        router.push('/quiz/create');
    };

    const handleDeleteClick = (id) => {
        setSelectedUserId(id);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedUserId(null);
    };

    const handleConfirmDelete = async () => {
        if (!selectedUserId) return;

        // Delete document from Firestore
        try {
            await deleteDoc(doc(db, 'users', selectedUserId));
            alert('삭제를 완료했습니다.');
            fetchQuizzes(); // Refresh quizzes after deletion
        } catch (error) {
            console.error('Error deleting document: ', error);
            alert('삭제 중 오류가 발생했습니다.');
        }

        setShowDeleteModal(false);
        setSelectedUserId(null);
    };

    const handleAdminPasswordSubmit = () => {
        const adminPassword = '1234'; // 실제 비밀번호는 안전한 방식으로 관리해야 합니다
        if (adminPasswordInput === adminPassword) {
            setIsAdmin(true);
            setShowAdminModal(false);
        } else {
            alert('비밀번호가 일치하지 않습니다.');
            router.push('/'); // 비밀번호가 틀리면 메인 페이지로 이동
        }
    };

    const handleAdminPasswordInputChange = (e) => {
        setAdminPasswordInput(e.target.value);
    };

    const ITEMS_PER_PAGE = 6;
    const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE); // 전체 페이지 수 계산

    const startIdx = (page - 1) * ITEMS_PER_PAGE;
    const endIdx = startIdx + ITEMS_PER_PAGE;
    const paginatedQuizzes = filteredUsers.slice(startIdx, endIdx); // 페이징 처리된 사용자 목록

    const generatePageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <PageNumber key={i} onClick={() => setPage(i)} active={i === page}>
                    {i}
                </PageNumber>
            );
        }
        return pageNumbers;
    };

    return (
        <Container>
            <Img className="aboutme" src="img/Group10.png"></Img>
            <Img className="test" src="img/testyour.png"></Img>
            <Img onClick={handleCreate} className="makequiz" src="img/Group 36.png"></Img>

            <SearchContainer>
                <SearchInput type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="친구 이름을 검색하세요" />
            </SearchContainer>
            <QuizContainer>
                {paginatedQuizzes.map((user) => (
                    <Box key={user.id}>
                        <QuizBox onClick={() => handleQuizClick(user.id)}>
                            <QuizName>{user.nickname}의 퀴즈</QuizName>
                        </QuizBox>
                        {isAdmin && <Img onClick={() => handleDeleteClick(user.id)} className="trash" src="img/trash.png"></Img>}
                    </Box>
                ))}
            </QuizContainer>
            <PageNavigation>
                <PageArrow onClick={() => setPage(Math.max(page - 1, 1))}>&lt;</PageArrow>
                {generatePageNumbers()}
                <PageArrow onClick={() => setPage(Math.min(page + 1, totalPages))}>&gt;</PageArrow>
            </PageNavigation>

            {showAdminModal && (
                <ModalBackground>
                    <ModalContainer>
                        <ModalTitle>관리자 비밀번호 입력</ModalTitle>
                        <ModalInput type="password" value={adminPasswordInput} onChange={handleAdminPasswordInputChange} maxLength={4} />
                        <ModalButtons>
                            <ModalButton onClick={handleAdminPasswordSubmit}>확인</ModalButton>
                            <ModalButton onClick={() => router.push('/')}>취소</ModalButton>
                        </ModalButtons>
                    </ModalContainer>
                </ModalBackground>
            )}

            {showDeleteModal && (
                <ModalBackground>
                    <ModalContainer>
                        <ModalTitle>삭제 확인</ModalTitle>
                        <ModalButtons>
                            <ModalButton onClick={handleConfirmDelete}>확인</ModalButton>
                            <ModalButton onClick={handleCloseDeleteModal}>취소</ModalButton>
                        </ModalButtons>
                    </ModalContainer>
                </ModalBackground>
            )}
        </Container>
    );
};

export default Home;

const Container = styled.div`
    min-height: 100vh;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    color: white; /* 텍스트 색상 */
    background-image: url('/img/Group52.png'); /* 배경 이미지 */
    background-repeat: no-repeat; /* 이미지 반복 없애기 */
    background-size: 90% 90%; /* 화면 가득 차게 */
    background-repeat: no-repeat; /* 이미지 반복 없애기 */
    background-position: center center; /* 중앙에 배치 */
`;

const SearchContainer = styled.div`
    display: flex;
    margin: 20px 0;
`;

const SearchInput = styled.input`
    padding: 15px;
    border-radius: 5px;
    outline: none;
    font-size: 1rem;
    background-color: white;
    color: #8b4513;
    &:focus {
        border-color: #transparent;
    }
    &::placeholder {
        color: #transparent;
    }
`;

const QuizContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    width: 70%;
    gap: 20px;
    align-items: center;
    justify-content: center;
    @media (max-width: 768px) {
        width: 90%;
    }
`;
const Box = styled.div`
    width: 200px;
    height: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 2px solid #402f5c;
    color: #402f5c;
    font-weight: bold;
    border-radius: 10px;
    background-color: #f1f1f1;
    cursor: pointer;
    &:hover {
        border: 2px solid #a0522d;
    }
    @media (max-width: 768px) {
        width: 150px;
        height: 80px;
    }
`;
const QuizBox = styled.div`
    color: black;
`;

const QuizName = styled.p`
    width: 100%;
    color: #402f5c;
    font-weight: bold;
    text-align: center;
    background-color: #f1f1f1;
    cursor: pointer;
`;

const PageNavigation = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 20px;
    color: #a0522d;
`;

const PageArrow = styled.div`
    cursor: pointer;
    padding: 10px;
    font-size: 1.5rem;
`;

const PageNumber = styled.div`
    cursor: pointer;
    padding: 10px;
    font-size: 1rem;
    ${({ active }) => active && `font-weight: bold;`}
`;

const ModalBackground = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContainer = styled.div`
    background: white;
    padding: 20px;
    border-radius: 5px;
    max-width: 90%;
    text-align: center;
`;

const ModalTitle = styled.h2`
    margin-bottom: 20px;
    color: black;
`;

const ModalInput = styled.input`
    padding: 10px;
    margin-bottom: 20px;
    width: 100%;
    border: 1px solid #ccc;
    border-radius: 5px;
    outline: none;
`;

const ModalButtons = styled.div`
    display: flex;
    justify-content: space-between;
`;

const ModalButton = styled.button`
    padding: 10px 20px;
    background: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    &:hover {
        background: #0056b3;
    }
`;
const Img = styled.img`
    &.aboutme {
        width: 600px;
        @media (max-width: 768px) {
            width: 350px;
        }
    }
    &.makequiz {
        margin: 20px 0 0;
        @media (max-width: 768px) {
            width: 100px;
        }
    }
    &.test {
        @media (max-width: 768px) {
            width: 250px;
        }
        width: 400px;
    }

    &.trash {
        width: 25px;
        margin-left: 5px;
    }
`;
