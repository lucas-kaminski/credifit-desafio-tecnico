'use client';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/api';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.auth.signup, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Erro ao criar conta');
        return;
      }
      router.push('/login');
    } catch {
      setError('Erro ao conectar com o servidor');
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg="gray.50">
      <Box
        bg="white"
        p={{ base: 6, md: 10 }}
        rounded="lg"
        shadow="md"
        w={{ base: '100%', sm: '350px', md: '400px' }}
        maxW="100%"
      >
        <form onSubmit={handleRegister}>
          <Flex direction="column" gap={6} align="stretch">
            <Text
              as="h1"
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
              color="purple.700"
            >
              Criar conta
            </Text>
            <Box>
              <Text mb={1}>Nome</Text>
              <Input
                type="text"
                placeholder="Digite seu nome"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Box>
            <Box>
              <Text mb={1}>Email</Text>
              <Input
                type="email"
                placeholder="Digite seu email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Box>
            <Box>
              <Text mb={1}>Senha</Text>
              <Input
                type="password"
                placeholder="Digite sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
              />
            </Box>
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            <Button colorScheme="purple" size="md" type="submit">
              Criar conta
            </Button>
            <Text
              fontSize="sm"
              color="gray.500"
              textAlign="center"
              cursor="pointer"
              onClick={() => router.push('/login')}
            >
              Já tem conta? Entrar
            </Text>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
}
