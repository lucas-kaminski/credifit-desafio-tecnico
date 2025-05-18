'use client';
import { Box, Button, Flex, Input, Text, useToast } from '@chakra-ui/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { API_ENDPOINTS } from '@/config/api';
import { Logo } from '../components/Logo';
import Head from 'next/head';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (password.length < 6) {
      toast({
        title: 'Senha inválida',
        description: 'A senha deve ter pelo menos 6 caracteres',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch(API_ENDPOINTS.auth.signup, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        toast({
          title: 'Erro ao criar conta',
          description: data.message || 'Erro ao criar conta. Tente novamente.',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
        return;
      }

      toast({
        title: 'Conta criada com sucesso!',
        description: 'Você será redirecionado para a página de login.',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      router.push('/login');
    } catch {
      toast({
        title: 'Erro ao conectar',
        description:
          'Erro ao conectar com o servidor. Tente novamente mais tarde.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>wordz - Criar conta</title>
      </Head>
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
              <Logo />
              <Text fontSize="lg" fontWeight="bold">
                Crie sua conta
              </Text>
              <Box>
                <Text mb={1}>Nome</Text>
                <Input
                  type="text"
                  placeholder="Digite seu nome"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={isLoading}
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
                  minLength={6}
                  disabled={isLoading}
                />
              </Box>
              <Button
                colorScheme="purple"
                size="md"
                type="submit"
                isLoading={isLoading}
                loadingText="Criando conta..."
              >
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
    </>
  );
}
