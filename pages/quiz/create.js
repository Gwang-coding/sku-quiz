import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import { db } from '../../config/firebase/firebase';
import { addDoc, collection, query, where, getDocs } from 'firebase/firestore';

const QuizForm = () => {
    const router = useRouter();
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [quizzes, setQuizzes] = useState([
        { id: 1, question: '', answer: null },
        { id: 2, question: '', answer: null },
        { id: 3, question: '', answer: null },
        { id: 4, question: '', answer: null },
        { id: 5, question: '', answer: null },
    ]);
    const [nicknameError, setNicknameError] = useState('');
    const [clickedButtons, setClickedButtons] = useState({}); // State to track clicked buttons

    useEffect(() => {
        if (nickname) {
            checkNicknameDuplicate(nickname);
        }
    }, [nickname]);

    // 닉네임 중복 검사 함수
    const checkNicknameDuplicate = async (nickname) => {
        const q = query(collection(db, 'users'), where('nickname', '==', nickname.toLowerCase()));
        const querySnapshot = await getDocs(q);

        if (!querySnapshot.empty) {
            setNicknameError('사용불가한 닉네임입니다.');
        } else {
            setNicknameError('');
        }
    };

    // 퀴즈 데이터를 Firestore에 저장하는 함수
    const saveQuizToFirestore = async () => {
        try {
            const userRef = await addDoc(collection(db, 'users'), {
                nickname: nickname.toLowerCase(),
                password: password,
                quizzes: quizzes.map((quiz) => ({ question: quiz.question, answer: quiz.answer })),
            });
            console.log('Document written with ID: ', userRef.id);
        } catch (error) {
            console.error('Error adding document: ', error);
        }
    };

    const handleQuestionChange = (id, value) => {
        setQuizzes((prevQuizzes) => prevQuizzes.map((quiz) => (quiz.id === id ? { ...quiz, question: value } : quiz)));
    };

    const handleAnswerChange = (id, value) => {
        const booleanValue = value === 'true';
        setQuizzes((prevQuizzes) => prevQuizzes.map((quiz) => (quiz.id === id ? { ...quiz, answer: booleanValue } : quiz)));
        setClickedButtons((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = () => {
        if (nicknameError) {
            alert('닉네임을 확인해주세요.');
            return;
        }

        saveQuizToFirestore();
        router.push('/');
    };

    return (
        <Container>
            <Img className="create" src="/img/group133.png"></Img>

            <Label>닉네임을 입력하세요:</Label>
            <SearchInput type="text" value={nickname} onChange={(e) => setNickname(e.target.value)} />
            {nicknameError && <div style={{ color: 'red' }}>{nicknameError}</div>}
            <br />
            <Label>비밀번호 (4자리 숫자):</Label>
            <SearchInput className="pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} maxLength={4} />
            <br />
            {quizzes.map((quiz) => (
                <div key={quiz.id}>
                    <Label>{`퀴즈 ${quiz.id}: `}</Label>
                    <SearchInput
                        className="quiz"
                        type="text"
                        value={quiz.question}
                        onChange={(e) => handleQuestionChange(quiz.id, e.target.value)}
                    />
                    <Btn onClick={() => handleAnswerChange(quiz.id, 'true')} clicked={clickedButtons[quiz.id] === 'true'}>
                        O
                    </Btn>
                    <Btn onClick={() => handleAnswerChange(quiz.id, 'false')} clicked={clickedButtons[quiz.id] === 'false'}>
                        X
                    </Btn>
                </div>
            ))}
            <Btnbox>
                <Img onClick={handleSubmit} className="btn" src="/img/group113.png"></Img>
                <Img onClick={() => router.push('/')} className="btn" src="/img/group112.png"></Img>
            </Btnbox>
        </Container>
    );
};

export default QuizForm;

const Container = styled.div`
    min-height: 100vh;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    color: white; /* 텍스트 색상 */
    background-image: url('/img/group52.png'); /* 배경 이미지 */
    background-repeat: no-repeat; /* 이미지 반복 없애기 */
    background-size: 90% 90%; /* 화면 가득 차게 */
    background-repeat: no-repeat; /* 이미지 반복 없애기 */
    background-position: center center; /* 중앙에 배치 */
`;
const Btnbox = styled.div`
    display: flex;
`;
const Img = styled.img`
    &.create {
        width: 300px;
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
    &.btn {
        width: 200px;
        &:hover {
            cursor: pointer;
        }
    }
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
    }

    &.quiz {
        width: 400px;
        margin: 5px 0;
        @media (max-width: 768px) {
            width: 300px;
        }
    }
    &.pw {
        height: 30px;
    }
`;
const Label = styled.label`
    color: black;
    font-weight: 600;
`;
const Btn = styled.button`
    background-color: ${({ clicked }) => (clicked ? '#FEB0DC' : '#402F5C')};
    color: ${({ clicked }) => (clicked ? '#402F5C' : 'white')};
    border: none;
    margin: 5px;
    width: 30px;
    height: 30px;
    &:hover {
        cursor: pointer;
    }
`;
