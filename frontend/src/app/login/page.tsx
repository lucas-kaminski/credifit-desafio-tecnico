'use client';
import { Box, Button, Flex, Input, Text, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.auth.signin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'Credenciais inválidas');
        return;
      }

      if (!data.token) {
        setError('Erro ao autenticar: token não recebido');
        return;
      }

      // Extract the token part (remove 'Bearer ' prefix if present)
      const token = data.token.startsWith('Bearer ')
        ? data.token.slice(7)
        : data.token;

      // Set the auth token cookie with proper attributes
      document.cookie = `auth_token=${token}; path=/; secure; samesite=strict`;

      toast({
        title: 'Login realizado com sucesso!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Redirect to home page
      router.push('/');
    } catch (err) {
      console.error('Erro durante o login:', err);
      setError('Erro ao conectar com o servidor');
    } finally {
      setIsLoading(false);
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </Box>
            {error && (
              <Text color="red.500" fontSize="sm">
                {error}
              </Text>
            )}
            <Button
              colorScheme="purple"
              size="md"
              type="submit"
              isLoading={isLoading}
              loadingText="Entrando..."
            >
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
