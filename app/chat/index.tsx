import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Icon from '@/components/LucideIcons';
import { MotiView, MotiText } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
}

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m YelpAI, your dining assistant. Ask me about restaurants, dietary preferences, popular dishes, or anything food-related!',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Auto-scroll to bottom when new messages arrive
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim() === '') return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse = generateAIResponse(userMessage.text);
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: aiResponse,
        sender: 'ai',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, aiMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (userQuestion: string): string => {
    const lowerQuestion = userQuestion.toLowerCase();

    if (lowerQuestion.includes('restaurant') || lowerQuestion.includes('food')) {
      return 'I can help you discover amazing restaurants! Try scanning a restaurant with the camera button, and I\'ll provide:\n\n• Detailed menu information\n• Popular dishes & reviews\n• Dietary labels (Vegan, Gluten-Free, etc.)\n• Personalized recommendations based on your preferences\n\nWhat type of cuisine are you interested in?';
    } else if (lowerQuestion.includes('vegan') || lowerQuestion.includes('dietary')) {
      return 'Great question about dietary preferences! I can:\n\n• Filter restaurants by dietary needs\n• Identify vegan, vegetarian, gluten-free options\n• Highlight allergen information\n• Suggest dishes that match your diet\n\nWould you like me to find restaurants with specific dietary options nearby?';
    } else if (lowerQuestion.includes('popular') || lowerQuestion.includes('dish')) {
      return 'I analyze thousands of reviews to identify:\n\n• Most popular dishes at each restaurant\n• Customer favorites & hidden gems\n• Trending menu items\n• Signature dishes worth trying\n\nScan a restaurant to see its top dishes instantly!';
    } else if (lowerQuestion.includes('hello') || lowerQuestion.includes('hi')) {
      return 'Hello! 👋 I\'m here to help you discover the best dining experiences. You can:\n\n• Scan restaurants with AR camera\n• Get AI-powered recommendations\n• Save your favorites\n• Explore menus & reviews\n\nHow can I assist you today?';
    } else {
      return 'That\'s an interesting question! Here\'s what I can help you with:\n\n• Restaurant recommendations & details\n• Menu items & popular dishes\n• Dietary preferences & filters\n• Reviews & ratings analysis\n• Personalized suggestions\n\nFeel free to ask me anything food-related, or use the camera to scan a restaurant!';
    }
  };

  const renderMessage = ({ item }: { item: Message }) => {
    const isAI = item.sender === 'ai';

    return (
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 400 }}
        style={[
          styles.messageContainer,
          isAI ? styles.aiMessageContainer : styles.userMessageContainer,
        ]}
      >
        {isAI && (
          <View style={[styles.aiAvatar, styles.aiAvatarWhite]}>
            <Image
              source={require('@/assets/images/chat.png')}
              style={styles.messageAvatarLogo}
              resizeMode="contain"
            />
          </View>
        )}

        <View
          style={[
            styles.messageBubble,
            isAI ? styles.aiMessageBubble : styles.userMessageBubble,
          ]}
        >
          {isAI && (
            <View style={styles.aiHeader}>
              <Icon name="Sparkles" size={14} color="#8B5CF6" />
              <Text style={styles.aiLabel}>YelpAI</Text>
            </View>
          )}
          <Text
            style={[
              styles.messageText,
              isAI ? styles.aiMessageText : styles.userMessageText,
            ]}
          >
            {item.text}
          </Text>
        </View>
      </MotiView>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <MotiView
        from={{ opacity: 0, translateY: 10 }}
        animate={{ opacity: 1, translateY: 0 }}
        style={styles.messageContainer}
      >
        <View style={[styles.aiAvatar, styles.aiAvatarWhite]}>
          <Image
            source={require('@/assets/images/chat.png')}
            style={styles.messageAvatarLogo}
            resizeMode="contain"
          />
        </View>
        <View style={[styles.messageBubble, styles.aiMessageBubble]}>
          <View style={styles.typingIndicator}>
            <MotiView
              from={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ loop: true, duration: 600, delay: 0 }}
              style={styles.typingDot}
            />
            <MotiView
              from={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ loop: true, duration: 600, delay: 200 }}
              style={styles.typingDot}
            />
            <MotiView
              from={{ opacity: 0.3 }}
              animate={{ opacity: 1 }}
              transition={{ loop: true, duration: 600, delay: 400 }}
              style={styles.typingDot}
            />
          </View>
        </View>
      </MotiView>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Icon name="ArrowLeft" size={24} color="#1A1A1A" />
        </TouchableOpacity>

        <View style={styles.headerCenter}>
          <View style={styles.headerAvatar}>
            <Image
              source={require('@/assets/images/chat.png')}
              style={styles.headerLogo}
              resizeMode="contain"
            />
          </View>
          <View>
            <Text style={styles.headerTitle}>YelpAI</Text>
            <Text style={styles.headerSubtitle}>Always here to help</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.menuButton}>
          <Icon name="MoreVertical" size={24} color="#1A1A1A" />
        </TouchableOpacity>
      </View>

      {/* Messages List */}
      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderTypingIndicator}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      {/* Input Area */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TouchableOpacity style={styles.attachButton}>
              <Icon name="Plus" size={24} color="#8E8E93" />
            </TouchableOpacity>

            <TextInput
              style={styles.input}
              placeholder="Chat here..."
              placeholderTextColor="#999"
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />

            {inputText.trim() === '' ? (
              <TouchableOpacity style={styles.voiceButton}>
                <Icon name="Mic" size={24} color="#8E8E93" />
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.sendButton}
                onPress={handleSend}
              >
                <LinearGradient
                  colors={['#8B5CF6', '#EC4899']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.sendGradient}
                >
                  <Icon name="Send" size={20} color="#FFF" />
                </LinearGradient>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FB',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 15,
  },
  headerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
  },
  headerLogo: {
    width: 28,
    height: 28,
  },
  avatarGradient: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#8E8E93',
    fontWeight: '500',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesList: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    paddingBottom: 20,
  },
  messageContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  aiMessageContainer: {
    justifyContent: 'flex-start',
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },
  aiAvatar: {
    marginRight: 12,
    marginTop: 4,
  },
  aiAvatarWhite: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#E5E5EA',
  },
  messageAvatarLogo: {
    width: 24,
    height: 24,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 20,
    padding: 16,
  },
  aiMessageBubble: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#F0F0F0',
    borderTopLeftRadius: 4,
  },
  userMessageBubble: {
    backgroundColor: '#1A1A1A',
    borderTopRightRadius: 4,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 6,
  },
  aiLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8B5CF6',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  messageText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
  },
  aiMessageText: {
    color: '#1A1A1A',
  },
  userMessageText: {
    color: '#FFF',
  },
  typingIndicator: {
    flexDirection: 'row',
    gap: 6,
    paddingVertical: 4,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#8B5CF6',
  },
  inputContainer: {
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
    paddingHorizontal: 20,
    paddingVertical: 15,
    paddingBottom: Platform.OS === 'ios' ? 25 : 15,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8F9FB',
    borderRadius: 25,
    paddingHorizontal: 8,
    paddingVertical: 8,
    gap: 8,
  },
  attachButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#1A1A1A',
    maxHeight: 100,
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  voiceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
  },
  sendGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

