import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { db } from '../../config/firebase/firebase'; // Firebase db import
import { updateDoc, doc, getDoc, arrayUnion } from 'firebase/firestore'; // Firestore 함수 import

export default function QuizPage() {
    const router = useRouter();
    const { id } = router.query;
    const [nickname, setNickname] = useState('');
    const [userName, setUserName] = useState(''); // 사용자 이름 state 추가
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState([]); // 답변 배열 state 추가
    const [score, setScore] = useState(0);
    const [clickedButtons, setClickedButtons] = useState({}); // State to track clicked buttons

    useEffect(() => {
        const fetchQuizData = async () => {
            try {
                const quizRef = doc(db, 'users', id);
                const quizSnap = await getDoc(quizRef);
                if (quizSnap.exists()) {
                    const quizData = quizSnap.data();
                    setNickname(quizData.nickname); // 닉네임 설정
                    setQuestions(quizData.quizzes.map((item) => ({ ...item, userAnswer: null })));
                    setAnswers(new Array(quizData.quizzes.length).fill(null)); // answers 초기화
                } else {
                    console.error('Quiz not found');
                }
            } catch (error) {
                console.error('Error fetching quiz:', error);
            }
        };

        if (id) {
            fetchQuizData();
        }
    }, [id]);

    const handleAnswerChange = (index, answer, value) => {
        const newAnswers = [...answers];
        newAnswers[index] = answer; // true/false 값으로 저장
        setAnswers(newAnswers);
        setClickedButtons((prev) => ({
            ...prev,
            [index]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            let userScore = 0;
            for (let i = 0; i < questions.length; i++) {
                if (answers[i] === questions[i].answer) {
                    userScore += 20;
                }
            }
            setScore(userScore);

            // Firestore에 저장할 데이터 객체
            const userAnswers = {
                userName: userName,
                score: userScore,
            };

            // Firestore 문서 업데이트
            const userRef = doc(db, 'users', id);
            try {
                await updateDoc(userRef, {
                    answers: arrayUnion(userAnswers),
                });

                console.log('Document successfully updated!');
            } catch (error) {
                console.error('Error updating document: ', error);
            }

            router.push(`/quiz/${id}/result?score=${userScore}`);
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    if (!nickname) {
        return <Container>Loading...</Container>;
    }

    return (
        <Container>
            <Title>{`${nickname}의 퀴즈 맞추기`}</Title>
            <Label>내 이름:</Label>
            <SearchInput type="text" value={userName} onChange={(e) => setUserName(e.target.value)} />
            <br />
            {questions.map((question, index) => (
                <Question key={index}>
                    <QuestionText>{question.question}</QuestionText>
                    <BtnBox>
                        <Btn onClick={() => handleAnswerChange(index, true, 'true')} clicked={clickedButtons[index] === 'true'}>
                            O
                        </Btn>
                        <Btn onClick={() => handleAnswerChange(index, false, 'false')} clicked={clickedButtons[index] === 'false'}>
                            X
                        </Btn>
                    </BtnBox>
                </Question>
            ))}
            <Btnbox>
                <Img onClick={handleSubmit} className="btn" src="/img/group 110.png"></Img>
                <Img onClick={() => router.push('/')} className="btn" src="/img/group 112.png"></Img>
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
    color: white; /* 텍스트 색상 */
    background-image: url('/img/Group 52.png'); /* 배경 이미지 */
    background-repeat: no-repeat; /* 이미지 반복 없애기 */
    background-size: 90% 90%; /* 화면 가득 차게 */
    background-repeat: no-repeat; /* 이미지 반복 없애기 */
    background-position: center center; /* 중앙에 배치 */
`;
const Btnbox = styled.div`
    display: flex;
`;
const Label = styled.label`
    color: black;
    font-weight: 600;
`;
const Title = styled.h1`
    font-size: 2rem;
    color: #402f5c;
    margin-bottom: 20px;
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
    }
    &.pw {
        height: 30px;
    }
`;
const Question = styled.div`
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    min-width: 400px;
    justify-content: space-between;
`;

const QuestionText = styled.p`
    font-size: 1.2rem;
    color: #402f5c;
    font-weight: 900;
`;
const BtnBox = styled.div``;
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
