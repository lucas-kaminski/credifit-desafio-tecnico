import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Input,
  Flex,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react';

interface WordItem {
  word: string;
  created_at?: string;
}

interface WordListTabsProps {
  wordList: string[];
  history: WordItem[];
  favorites: WordItem[];
  onSelectWord: (word: string) => void;
  onSearchWord: (search: string) => void;
  onLoadMore: () => void;
  hasMore: boolean;
  loadingMore: boolean;
  onLoadMoreHistory: () => void;
  onLoadMoreFavorites: () => void;
  hasMoreHistory: boolean;
  hasMoreFavorites: boolean;
  loadingMoreHistory: boolean;
  loadingMoreFavorites: boolean;
  initialSearch?: string;
}

export function WordListTabs({
  wordList,
  history,
  favorites,
  onSelectWord,
  onSearchWord,
  onLoadMore,
  hasMore,
  loadingMore,
  onLoadMoreHistory,
  onLoadMoreFavorites,
  hasMoreHistory,
  hasMoreFavorites,
  loadingMoreHistory,
  loadingMoreFavorites,
  initialSearch = '',
}: WordListTabsProps) {
  const [search, setSearch] = useState(initialSearch);
  const observer = useRef<IntersectionObserver | null>(null);
  const historyObserver = useRef<IntersectionObserver | null>(null);
  const favoritesObserver = useRef<IntersectionObserver | null>(null);

  const lastWordElementRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (loadingMore) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          onLoadMore();
        }
      });
      if (node) observer.current.observe(node);
    },
    [loadingMore, hasMore, onLoadMore]
  );

  const lastHistoryElementRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (loadingMoreHistory) return;
      if (historyObserver.current) historyObserver.current.disconnect();
      historyObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreHistory) {
          onLoadMoreHistory();
        }
      });
      if (node) historyObserver.current.observe(node);
    },
    [loadingMoreHistory, hasMoreHistory, onLoadMoreHistory]
  );

  const lastFavoriteElementRef = useCallback(
    (node: HTMLButtonElement | null) => {
      if (loadingMoreFavorites) return;
      if (favoritesObserver.current) favoritesObserver.current.disconnect();
      favoritesObserver.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMoreFavorites) {
          onLoadMoreFavorites();
        }
      });
      if (node) favoritesObserver.current.observe(node);
    },
    [loadingMoreFavorites, hasMoreFavorites, onLoadMoreFavorites]
  );

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  // Filtro só para a aba Word List
  const filteredWords = wordList.filter((w) =>
    w.toLowerCase().includes(search.toLowerCase())
  );

  const renderWordGrid = (words: string[]) => (
    <Box>
      <Alert status="info" mb={4} borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>Lista de palavras importada</AlertTitle>
          <AlertDescription>
            As palavras são importadas de um arquivo e nem todas terão seu
            significado disponível na API Free Dictionary.
          </AlertDescription>
        </Box>
      </Alert>
      <Input
        placeholder="Procurar palavra..."
        mb={4}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
          onSearchWord(e.target.value);
        }}
      />
      <Flex direction="column" gap={4}>
        <Flex wrap="wrap" gap={2}>
          {words.map((word, idx) => (
            <Button
              key={word + '-' + idx}
              size="sm"
              variant="outline"
              colorScheme="purple"
              onClick={() => onSelectWord(word)}
              ref={idx === words.length - 1 ? lastWordElementRef : undefined}
            >
              {word}
            </Button>
          ))}
        </Flex>
        {loadingMore && (
          <Flex justify="center" py={4}>
            <Spinner color="purple.500" />
          </Flex>
        )}
      </Flex>
    </Box>
  );

  const renderHistoryOrFavorites = (
    items: WordItem[],
    hasMore: boolean,
    loadingMore: boolean,
    onLoadMore: () => void,
    lastElementRef: (node: HTMLButtonElement | null) => void,
    type: 'history' | 'favorites'
  ) => (
    <Box>
      <Alert status="info" mb={4} borderRadius="md">
        <AlertIcon />
        <Box>
          <AlertTitle>
            {type === 'history'
              ? 'Histórico de palavras'
              : 'Palavras favoritas'}
          </AlertTitle>
          <AlertDescription>
            {type === 'history'
              ? 'Aqui você encontra todas as palavras que você já consultou.'
              : 'Aqui você encontra todas as palavras que você marcou como favoritas.'}
          </AlertDescription>
        </Box>
      </Alert>
      <Flex direction="column" gap={4}>
        <Flex wrap="wrap" gap={2}>
          {items.map((item, idx) => (
            <Button
              key={item.word + '-' + idx}
              size="sm"
              variant="outline"
              colorScheme="purple"
              onClick={() => onSelectWord(item.word)}
              ref={idx === items.length - 1 ? lastElementRef : undefined}
            >
              {item.word}
            </Button>
          ))}
        </Flex>
        {loadingMore && (
          <Flex justify="center" py={4}>
            <Spinner color="purple.500" />
          </Flex>
        )}
      </Flex>
    </Box>
  );

  return (
    <Tabs variant="enclosed" colorScheme="purple" isFitted>
      <TabList>
        <Tab>Lista de palavras</Tab>
        <Tab>Histórico</Tab>
        <Tab>Favoritos</Tab>
      </TabList>
      <TabPanels>
        <TabPanel>{renderWordGrid(filteredWords)}</TabPanel>
        <TabPanel>
          {renderHistoryOrFavorites(
            history,
            hasMoreHistory,
            loadingMoreHistory,
            onLoadMoreHistory,
            lastHistoryElementRef,
            'history'
          )}
        </TabPanel>
        <TabPanel>
          {renderHistoryOrFavorites(
            favorites,
            hasMoreFavorites,
            loadingMoreFavorites,
            onLoadMoreFavorites,
            lastFavoriteElementRef,
            'favorites'
          )}
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}
