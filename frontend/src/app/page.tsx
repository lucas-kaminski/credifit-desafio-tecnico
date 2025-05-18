'use client';
import { useEffect, useState, Suspense } from 'react';
import {
  Flex,
  Box,
  useBreakpointValue,
  Spinner,
  Text,
  Button,
  HStack,
} from '@chakra-ui/react';
import { WordCard } from './components/WordCard';
import { WordListTabs } from './components/WordListTabs';
import { API_ENDPOINTS } from '@/config/api';
import { fetchWithAuth } from '@/utils/api';
import { useSearchParams } from 'next/navigation';

function HomeContent() {
  const searchParams = useSearchParams();
  const [wordList, setWordList] = useState<string[]>([]);
  const [history, setHistory] = useState<
    Array<{ word: string; created_at: string }>
  >([]);
  const [favorites, setFavorites] = useState<
    Array<{ word: string; created_at: string }>
  >([]);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [synonymTrigger, setSynonymTrigger] = useState(0);
  const [wordDetails, setWordDetails] = useState<{
    word: string;
    phonetic?: string;
    meanings?: Array<{ partOfSpeech: string; definitions: string[] }>;
    audioUrls?: string[];
    synonyms?: string[];
    antonyms?: string[];
    sourceUrls?: string[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingWord, setLoadingWord] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [currentSearch, setCurrentSearch] = useState('');
  const [historyPage, setHistoryPage] = useState(1);
  const [favoritesPage, setFavoritesPage] = useState(1);
  const [hasMoreHistory, setHasMoreHistory] = useState(true);
  const [hasMoreFavorites, setHasMoreFavorites] = useState(true);
  const [loadingMoreHistory, setLoadingMoreHistory] = useState(false);
  const [loadingMoreFavorites, setLoadingMoreFavorites] = useState(false);
  const isMobile = useBreakpointValue({ base: true, md: false });
  const [user, setUser] = useState<{
    NAME: string;
    ID: string;
    EMAIL: string;
  } | null>(null);

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && selectedWord) {
        handleCloseWord();
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [selectedWord]);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [wordsRes, historyRes, favoritesRes, profileRes] =
          await Promise.all([
            fetchWithAuth(API_ENDPOINTS.entries.list),
            fetchWithAuth(API_ENDPOINTS.user.history),
            fetchWithAuth(API_ENDPOINTS.user.favorites),
            fetchWithAuth(API_ENDPOINTS.user.profile),
          ]);
        const wordsRaw = await wordsRes.json();
        const historyData = await historyRes.json();
        const favoritesData = await favoritesRes.json();
        const profileData = await profileRes.json();

        console.log('Profile data:', profileData);

        setWordList(wordsRaw.results || []);
        setHasMore(wordsRaw.hasNext || false);
        setHistory(historyData.results || []);
        setFavorites(favoritesData.results || []);
        setUser(profileData);

        // Check for word parameter in URL
        const wordFromUrl = searchParams.get('word');
        if (wordFromUrl) {
          setSelectedWord(wordFromUrl);
          setCurrentSearch(wordFromUrl);
          // Perform initial search for related words
          const searchRes = await fetchWithAuth(
            `${API_ENDPOINTS.entries.list}?search=${encodeURIComponent(
              wordFromUrl
            )}&page=1`
          );
          const searchData = await searchRes.json();
          setWordList(
            Array.isArray(searchData.results) ? searchData.results : []
          );
          setHasMore(searchData.hasNext || false);
        } else {
          setSelectedWord(null);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setWordList([]);
        setHistory([]);
        setFavorites([]);
        setUser(null);
        setSelectedWord(null);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [searchParams]);

  useEffect(() => {
    if (!selectedWord) return;
    setLoadingWord(true);
    setError(null);
    fetchWithAuth(API_ENDPOINTS.entries.details(selectedWord))
      .then(async (res) => {
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Palavra não encontrada');
        }
        return res.json();
      })
      .then((data) => {
        const audioUrls = Array.isArray(data.phonetics)
          ? data.phonetics
              .filter((p: { audio?: string }) => p.audio && p.audio.length > 0)
              .map((p: { audio: string }) => p.audio)
          : [];
        const meanings =
          Array.isArray(data.meanings) && data.meanings.length > 0
            ? data.meanings.map(
                (m: {
                  partOfSpeech: string;
                  definitions: { definition: string }[];
                }) => ({
                  partOfSpeech: m.partOfSpeech,
                  definitions:
                    m.definitions?.map(
                      (d: { definition: string }) => d.definition
                    ) || [],
                })
              )
            : [];
        const synonyms: string[] =
          Array.isArray(data.meanings) && data.meanings.length > 0
            ? Array.from(
                new Set(
                  data.meanings.flatMap(
                    (m: { synonyms?: string[] }) => m.synonyms || []
                  )
                )
              )
            : [];
        const antonyms: string[] =
          Array.isArray(data.meanings) && data.meanings.length > 0
            ? Array.from(
                new Set(
                  data.meanings.flatMap(
                    (m: { antonyms?: string[] }) => m.antonyms || []
                  )
                )
              )
            : [];
        const sourceUrls: string[] = Array.isArray(data.sourceUrls)
          ? data.sourceUrls
          : [];
        setWordDetails({
          word: data.word,
          phonetic: data.phonetic,
          meanings,
          audioUrls,
          synonyms,
          antonyms,
          sourceUrls,
        });
        setHistory((prev) => {
          const now = new Date().toISOString();
          return [{ word: selectedWord, created_at: now }, ...prev];
        });
      })
      .catch((error) => {
        console.error('Error fetching word details:', error);
        setError(error.message || 'Erro ao buscar detalhes da palavra');
        setWordDetails(null);
      })
      .finally(() => setLoadingWord(false));
  }, [selectedWord, synonymTrigger]);

  const handleSelectSynonym = (syn: string) => {
    setSelectedWord(syn);
    setSynonymTrigger((t) => t + 1);
  };

  const handleSelectAntonym = (ant: string) => {
    setSelectedWord(ant);
    setSynonymTrigger((t) => t + 1);
  };

  const handleLoadMore = async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const searchParam = currentSearch
        ? `&search=${encodeURIComponent(currentSearch)}`
        : '';
      const res = await fetchWithAuth(
        `${API_ENDPOINTS.entries.list}?page=${nextPage}${searchParam}`
      );
      const data = await res.json();
      const newWords = data.results || [];

      if (newWords.length === 0) {
        setHasMore(false);
      } else {
        setWordList((prev) => [...prev, ...newWords]);
        setHasMore(data.hasNext || false);
        setCurrentPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more words:', error);
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  const handleSearchWord = async (search: string) => {
    try {
      setCurrentPage(1);
      setCurrentSearch(search);
      const res = await fetchWithAuth(
        `${API_ENDPOINTS.entries.list}?search=${encodeURIComponent(
          search
        )}&page=1`
      );
      const data = await res.json();
      setWordList(Array.isArray(data.results) ? data.results : []);
      setHasMore(data.hasNext || false);
    } catch {
      setWordList([]);
      setHasMore(false);
    }
  };

  const handleSelectWord = (word: string) => {
    setSelectedWord(word);
  };

  const handleToggleFavorite = async (word: string) => {
    const isFavorite = favorites.some((f) => f.word === word);
    try {
      if (isFavorite) {
        await fetchWithAuth(API_ENDPOINTS.entries.unfavorite(word), {
          method: 'DELETE',
        });
        setFavorites((prev) => prev.filter((f) => f.word !== word));
      } else {
        await fetchWithAuth(API_ENDPOINTS.entries.favorite(word), {
          method: 'POST',
        });
        const now = new Date().toISOString();
        setFavorites((prev) => [{ word, created_at: now }, ...prev]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const handleLoadMoreHistory = async () => {
    if (loadingMoreHistory || !hasMoreHistory) return;

    setLoadingMoreHistory(true);
    try {
      const nextPage = historyPage + 1;
      const res = await fetchWithAuth(
        `${API_ENDPOINTS.user.history}?page=${nextPage}`
      );
      const data = await res.json();
      const newHistory = data.results || [];

      if (newHistory.length === 0) {
        setHasMoreHistory(false);
      } else {
        setHistory((prev) => [...prev, ...newHistory]);
        setHasMoreHistory(data.hasNext || false);
        setHistoryPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more history:', error);
      setHasMoreHistory(false);
    } finally {
      setLoadingMoreHistory(false);
    }
  };

  const handleLoadMoreFavorites = async () => {
    if (loadingMoreFavorites || !hasMoreFavorites) return;

    setLoadingMoreFavorites(true);
    try {
      const nextPage = favoritesPage + 1;
      const res = await fetchWithAuth(
        `${API_ENDPOINTS.user.favorites}?page=${nextPage}`
      );
      const data = await res.json();
      const newFavorites = data.results || [];

      if (newFavorites.length === 0) {
        setHasMoreFavorites(false);
      } else {
        setFavorites((prev) => [...prev, ...newFavorites]);
        setHasMoreFavorites(data.hasNext || false);
        setFavoritesPage(nextPage);
      }
    } catch (error) {
      console.error('Error loading more favorites:', error);
      setHasMoreFavorites(false);
    } finally {
      setLoadingMoreFavorites(false);
    }
  };

  const handleCloseWord = () => {
    setSelectedWord(null);
    setWordDetails(null);
    setError(null);
    setLoadingWord(false);
  };

  if (loading) {
    return (
      <Flex h="100vh" align="center" justify="center">
        <Spinner size="xl" color="purple.500" />
      </Flex>
    );
  }

  return (
    <Flex
      h={{ base: 'auto', md: '100vh' }}
      minH={{ base: '100vh', md: '100vh' }}
      direction="column"
      overflow={{ base: 'auto', md: 'hidden' }}
    >
      <HStack
        w="100%"
        p={4}
        bg="purple.700"
        color="white"
        justify="space-between"
        align="center"
      >
        <Text fontSize="lg" fontWeight="bold">
          {user?.NAME ? `Olá, ${user.NAME}` : 'Olá'}
        </Text>
        <Button
          variant="ghost"
          color="white"
          _hover={{ bg: 'purple.600' }}
          onClick={() => {
            document.cookie =
              'auth_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
            window.location.href = '/login';
          }}
        >
          Sair
        </Button>
      </HStack>
      <Flex
        flex={1}
        direction={isMobile ? 'column' : 'row'}
        overflow={{ base: 'auto', md: 'auto' }}
      >
        {/* Esquerda: WordCard */}
        <Box
          w={{ base: '100%', md: '40%' }}
          minW="320px"
          p={4}
          bg="white"
          h={{ base: 'auto', md: 'auto' }}
          overflow={{ base: 'auto', md: 'auto' }}
        >
          {selectedWord ? (
            loadingWord ? (
              <Flex h="100%" align="center" justify="center">
                <Spinner size="xl" color="purple.500" />
              </Flex>
            ) : error ? (
              <Flex
                direction="column"
                align="center"
                justify="center"
                h="100%"
                textAlign="center"
                p={4}
                gap={4}
              >
                <Text fontSize="xl" color="red.500" fontWeight="bold">
                  Palavra não encontrada
                </Text>
                <Text color="gray.600">
                  A palavra &quot;{selectedWord}&quot; não foi encontrada na
                  API.
                </Text>
                <Button colorScheme="purple" onClick={handleCloseWord} mt={4}>
                  Voltar
                </Button>
              </Flex>
            ) : (
              <WordCard
                word={wordDetails?.word || ''}
                phonetic={wordDetails?.phonetic}
                meanings={wordDetails?.meanings}
                audioUrls={wordDetails?.audioUrls}
                synonyms={wordDetails?.synonyms}
                antonyms={wordDetails?.antonyms}
                sourceUrls={wordDetails?.sourceUrls}
                onPrev={() => {
                  const idx = wordList.indexOf(selectedWord);
                  if (idx > 0) handleSelectWord(wordList[idx - 1]);
                }}
                onNext={() => {
                  const idx = wordList.indexOf(selectedWord);
                  if (idx < wordList.length - 1)
                    handleSelectWord(wordList[idx + 1]);
                }}
                onSelectSynonym={handleSelectSynonym}
                onSelectAntonym={handleSelectAntonym}
                isFavorite={favorites.some((f) => f.word === wordDetails?.word)}
                onToggleFavorite={() =>
                  wordDetails?.word && handleToggleFavorite(wordDetails.word)
                }
              />
            )
          ) : (
            <Flex
              direction="column"
              align="center"
              justify="center"
              h="100%"
              textAlign="center"
              p={4}
              gap={4}
            >
              <Text fontSize="xl" color="purple.700" fontWeight="bold">
                Bem-vindo ao Wordz!
              </Text>
              <Text color="gray.600">
                Selecione uma palavra da lista ou use a busca para começar.
              </Text>
            </Flex>
          )}
        </Box>
        {/* Direita: Abas */}
        <Box
          flex={1}
          p={4}
          bg="gray.50"
          h={{ base: 'auto', md: 'auto' }}
          overflow={{ base: 'auto', md: 'auto' }}
        >
          <WordListTabs
            wordList={wordList}
            history={history}
            favorites={favorites}
            onSelectWord={handleSelectWord}
            onSearchWord={handleSearchWord}
            onLoadMore={handleLoadMore}
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMoreHistory={handleLoadMoreHistory}
            onLoadMoreFavorites={handleLoadMoreFavorites}
            hasMoreHistory={hasMoreHistory}
            hasMoreFavorites={hasMoreFavorites}
            loadingMoreHistory={loadingMoreHistory}
            loadingMoreFavorites={loadingMoreFavorites}
            initialSearch={currentSearch}
          />
        </Box>
      </Flex>
      {isMobile && selectedWord && (
        <Box
          pos="fixed"
          top={0}
          left={0}
          w="100vw"
          h="100vh"
          bg="white"
          zIndex={10}
          p={4}
          overflow="auto"
        >
          {loadingWord ? (
            <Flex align="center" justify="center" h="100%">
              <Spinner size="lg" color="purple.500" />
            </Flex>
          ) : error ? (
            <Flex
              direction="column"
              align="center"
              justify="center"
              h="100%"
              textAlign="center"
              p={4}
            >
              <Text color="red.500" fontSize="lg" mb={4}>
                {error}
              </Text>
              <Button colorScheme="purple" onClick={handleCloseWord}>
                Voltar
              </Button>
            </Flex>
          ) : (
            <WordCard
              word={wordDetails?.word || ''}
              phonetic={wordDetails?.phonetic}
              meanings={wordDetails?.meanings}
              audioUrls={wordDetails?.audioUrls}
              synonyms={wordDetails?.synonyms}
              antonyms={wordDetails?.antonyms}
              sourceUrls={wordDetails?.sourceUrls}
              onPrev={() => {
                const idx = wordList.indexOf(selectedWord);
                if (idx > 0) handleSelectWord(wordList[idx - 1]);
              }}
              onNext={() => {
                const idx = wordList.indexOf(selectedWord);
                if (idx < wordList.length - 1)
                  handleSelectWord(wordList[idx + 1]);
              }}
              onClose={handleCloseWord}
              onSelectSynonym={handleSelectSynonym}
              onSelectAntonym={handleSelectAntonym}
              isFavorite={favorites.some((f) => f.word === wordDetails?.word)}
              onToggleFavorite={() =>
                wordDetails?.word && handleToggleFavorite(wordDetails.word)
              }
            />
          )}
        </Box>
      )}
    </Flex>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<Spinner />}>
      <HomeContent />
    </Suspense>
  );
}
