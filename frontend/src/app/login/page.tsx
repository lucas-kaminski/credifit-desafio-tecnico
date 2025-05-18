'use client';
import { Box, Button, Flex, Input, Text, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/api';
import { Logo } from '../components/Logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleForgotPassword = () => {
    toast({
      title: 'Funcionalidade em desenvolvimento',
      description:
        'A recuperação de senha está fora do escopo do desafio técnico.',
      status: 'info',
      duration: 3000,
      isClosable: true,
    });
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await fetch(API_ENDPOINTS.auth.signin, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast({
          title: 'Erro ao fazer login',
          description: data.message || 'Email ou senha inválidos',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      if (!data.token) {
        toast({
          title: 'Erro ao autenticar',
          description: 'Token não recebido. Tente novamente.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
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
      toast({
        title: 'Erro ao conectar',
        description:
          'Erro ao conectar com o servidor. Tente novamente mais tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
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
            <Logo />
            <Text fontSize="lg" fontWeight="bold">
              Faça login para continuar
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
            <Text
              fontSize="sm"
              color="purple.500"
              textAlign="right"
              cursor="pointer"
              onClick={handleForgotPassword}
              _hover={{ textDecoration: 'underline' }}
            >
              Esqueci minha senha
            </Text>
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
