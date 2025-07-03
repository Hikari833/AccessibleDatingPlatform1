import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { MessageWithSender } from '@shared/schema';
import { Search, Send, Phone, Video, MoreHorizontal } from 'lucide-react';
import { useAccessibilityContext } from '@/components/accessibility-provider';

export default function Messages() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const { announceToScreenReader } = useAccessibilityContext();

  // This would be the current user's ID from auth context
  const currentUserId = 1;

  const { data: conversations = [] } = useQuery({
    queryKey: ['/api/conversations', currentUserId],
    queryFn: () => fetch(`/api/conversations/${currentUserId}`).then(res => res.json()),
  });

  const { data: messages = [] } = useQuery({
    queryKey: ['/api/messages', currentUserId, selectedConversation],
    queryFn: () => {
      if (!selectedConversation) return [];
      return fetch(`/api/messages/${currentUserId}/${selectedConversation}`).then(res => res.json());
    },
    enabled: !!selectedConversation,
  });

  // Group conversations by unique users
  const uniqueConversations = conversations.reduce((acc: any[], message: MessageWithSender) => {
    const otherUserId = message.senderId === currentUserId ? message.receiverId : message.senderId;
    if (!acc.find(conv => conv.userId === otherUserId)) {
      acc.push({
        userId: otherUserId,
        lastMessage: message,
        unreadCount: conversations.filter((m: MessageWithSender) => 
          (m.senderId === otherUserId && m.receiverId === currentUserId && !m.isRead)
        ).length,
      });
    }
    return acc;
  }, []);

  const handleConversationSelect = (userId: number) => {
    setSelectedConversation(userId);
    announceToScreenReader(`Selected conversation with user ${userId}`);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // Send message mutation would go here
    setNewMessage('');
    announceToScreenReader('Message sent');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        {/* Conversations List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Messages
              <Badge variant="secondary">{uniqueConversations.length}</Badge>
            </CardTitle>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search conversations..."
                className="pl-10"
                aria-label="Search conversations"
              />
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {uniqueConversations.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <p>No conversations yet</p>
                  <p className="text-sm">Start by messaging someone you've matched with!</p>
                </div>
              ) : (
                uniqueConversations.map((conversation) => (
                  <button
                    key={conversation.userId}
                    onClick={() => handleConversationSelect(conversation.userId)}
                    className={`w-full p-4 text-left hover:bg-muted focus:bg-muted focus:outline-none ${
                      selectedConversation === conversation.userId ? 'bg-muted' : ''
                    }`}
                    aria-label={`Conversation with ${conversation.lastMessage.sender.username}`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={`https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face`} />
                        <AvatarFallback>
                          {conversation.lastMessage.sender.username.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm truncate">
                            {conversation.lastMessage.sender.username}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(conversation.lastMessage.sentAt).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                        <p className="text-sm text-muted-foreground truncate">
                          {conversation.lastMessage.content}
                        </p>
                      </div>
                      {conversation.unreadCount > 0 && (
                        <Badge variant="destructive" className="ml-2">
                          {conversation.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="lg:col-span-2 flex flex-col">
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div className="flex items-center space-x-3">
                  <Avatar>
                    <AvatarImage src={`https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face`} />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">User {selectedConversation}</h3>
                    <p className="text-sm text-muted-foreground">Online now</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="sm" aria-label="Voice call">
                    <Phone className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" aria-label="Video call">
                    <Video className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" aria-label="More options">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <Separator />

              {/* Messages */}
              <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.length === 0 ? (
                  <div className="text-center text-muted-foreground py-8">
                    <p>No messages yet</p>
                    <p className="text-sm">Start the conversation below!</p>
                  </div>
                ) : (
                  messages.map((message: MessageWithSender) => (
                    <div
                      key={message.id}
                      className={`flex ${message.senderId === currentUserId ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.senderId === currentUserId
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-75 mt-1">
                          {new Date(message.sentAt).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex space-x-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    className="flex-1"
                    aria-label="Type your message"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Press Enter to send • Ctrl+Shift+V for voice input
                </p>
              </div>
            </>
          ) : (
            <CardContent className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <p>Select a conversation to start messaging</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
