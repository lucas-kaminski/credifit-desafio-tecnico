'use client';
import { Box, Button, Flex, Input, Text } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.auth.signin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.message || 'Credenciais inválidas');
        return;
      }
      router.push('/');
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
        <form onSubmit={handleLogin}>
          <Flex direction="column" gap={6} align="stretch">
            <Text
              as="h1"
              fontSize="2xl"
              fontWeight="bold"
              textAlign="center"
              color="purple.700"
            >
              Login
            </Text>
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
              />
            </Box>
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            <Button colorScheme="purple" size="md" type="submit">
              Entrar
            </Button>
            <Text
              fontSize="sm"
              color="gray.500"
              textAlign="center"
              cursor="pointer"
              onClick={() => router.push('/register')}
            >
              Criar minha conta
            </Text>
          </Flex>
        </form>
      </Box>
    </Flex>
  );
}
