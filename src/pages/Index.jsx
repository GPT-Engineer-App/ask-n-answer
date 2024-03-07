import { Box, Button, Container, Flex, Heading, Stack, Input, Textarea, Text, VStack, HStack, IconButton, useToast } from "@chakra-ui/react";
import { FaPlus, FaArrowUp, FaArrowDown } from "react-icons/fa";
import { useState } from "react";

const Index = () => {
  const [questions, setQuestions] = useState([]);
  const [questionInput, setQuestionInput] = useState("");
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answerInput, setAnswerInput] = useState("");
  const toast = useToast();

  const handleQuestionSubmit = () => {
    if (!questionInput.trim()) {
      toast({
        title: "Error.",
        description: "Question cannot be empty.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const newQuestion = {
      id: Date.now(),
      text: questionInput,
      answers: [],
    };
    setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
    setQuestionInput("");
  };

  const handleAnswerSubmit = () => {
    if (!answerInput.trim()) {
      toast({
        title: "Error.",
        description: "Answer cannot be empty.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const updatedQuestions = questions.map((q) => {
      if (q.id === activeQuestion.id) {
        const newAnswer = {
          id: Date.now(),
          text: answerInput,
          votes: 0,
        };
        return { ...q, answers: [...q.answers, newAnswer] };
      }
      return q;
    });
    setQuestions(updatedQuestions);
    setAnswerInput("");
  };

  const handleVote = (answerId, direction) => {
    const updatedQuestions = questions.map((q) => {
      if (q.id === activeQuestion.id) {
        const updatedAnswers = q.answers.map((a) => {
          if (a.id === answerId) {
            return { ...a, votes: a.votes + (direction === "up" ? 1 : -1) };
          }
          return a;
        });
        return { ...q, answers: updatedAnswers };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  return (
    <Container maxW="container.xl" py={10}>
      <VStack spacing={6}>
        <Heading as="h1" size="2xl">
          Q&A Bulletin Board
        </Heading>
        <Box w="100%">
          <Textarea value={questionInput} onChange={(e) => setQuestionInput(e.target.value)} placeholder="Type your question here..." mb={4} />
          <Button leftIcon={<FaPlus />} colorScheme="teal" variant="solid" onClick={handleQuestionSubmit}>
            Submit Question
          </Button>
        </Box>
        <VStack spacing={4} align="stretch" w="100%">
          {questions.map((question) => (
            <Box key={question.id} p={5} shadow="md" borderWidth="1px">
              <Text mb={2}>{question.text}</Text>
              <Button size="sm" onClick={() => setActiveQuestion(question)}>
                Answer
              </Button>
              {activeQuestion && activeQuestion.id === question.id && (
                <Box mt={4}>
                  <Textarea value={answerInput} onChange={(e) => setAnswerInput(e.target.value)} placeholder="Provide your answer..." mb={4} />
                  <Button leftIcon={<FaPlus />} colorScheme="green" onClick={handleAnswerSubmit}>
                    Submit Answer
                  </Button>
                  <VStack spacing={4} mt={4}>
                    {question.answers.map((answer) => (
                      <Flex key={answer.id} align="center" justify="space-between">
                        <Text>{answer.text}</Text>
                        <HStack>
                          <IconButton aria-label="Upvote" icon={<FaArrowUp />} size="sm" variant="ghost" onClick={() => handleVote(answer.id, "up")} />
                          <Text>{answer.votes}</Text>
                          <IconButton aria-label="Downvote" icon={<FaArrowDown />} size="sm" variant="ghost" onClick={() => handleVote(answer.id, "down")} />
                        </HStack>
                      </Flex>
                    ))}
                  </VStack>
                </Box>
              )}
            </Box>
          ))}
        </VStack>
      </VStack>
    </Container>
  );
};

export default Index;
