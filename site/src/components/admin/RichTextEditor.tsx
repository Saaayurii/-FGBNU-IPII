'use client';

import { useCallback, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  Quote,
  Type,
  AlignLeft,
  AlignCenter,
  AlignRight
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export function RichTextEditor({
  value,
  onChange,
  label,
  placeholder = 'Введите текст...',
  className = ''
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const handleCommand = useCallback((command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  }, []);

  const handleInput = useCallback(() => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  }, [onChange]);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    document.execCommand('insertText', false, text);
  }, []);

  const insertLink = useCallback(() => {
    const url = prompt('Введите URL:');
    if (url) {
      handleCommand('createLink', url);
    }
  }, [handleCommand]);

  const formatButtons = [
    { command: 'bold', icon: Bold, title: 'Жирный' },
    { command: 'italic', icon: Italic, title: 'Курсив' },
    { command: 'underline', icon: Underline, title: 'Подчеркивание' },
    { command: 'insertUnorderedList', icon: List, title: 'Маркированный список' },
    { command: 'insertOrderedList', icon: ListOrdered, title: 'Нумерованный список' },
    { command: 'justifyLeft', icon: AlignLeft, title: 'По левому краю' },
    { command: 'justifyCenter', icon: AlignCenter, title: 'По центру' },
    { command: 'justifyRight', icon: AlignRight, title: 'По правому краю' },
  ];

  return (
    <div className={className}>
      {label && <Label className="mb-2 block">{label}</Label>}
      <div className={`border rounded-md overflow-hidden bg-background ${isFocused ? 'ring-2 ring-primary' : ''}`}>
        <div className="border-b bg-muted p-2 flex gap-1 flex-wrap">
          <select 
            className="px-2 py-1 border rounded text-sm bg-background text-foreground"
            onChange={(e) => handleCommand('formatBlock', e.target.value)}
            defaultValue=""
          >
            <option value="">Обычный текст</option>
            <option value="h1">Заголовок 1</option>
            <option value="h2">Заголовок 2</option>
            <option value="h3">Заголовок 3</option>
            <option value="blockquote">Цитата</option>
          </select>
          
          {formatButtons.map(({ command, icon: Icon, title }) => (
            <Button
              key={command}
              type="button"
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => handleCommand(command)}
              title={title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          ))}
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={insertLink}
            title="Вставить ссылку"
          >
            <Link className="h-4 w-4" />
          </Button>
          
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
            onClick={() => handleCommand('formatBlock', 'blockquote')}
            title="Цитата"
          >
            <Quote className="h-4 w-4" />
          </Button>
        </div>
        
        <div
          ref={editorRef}
          contentEditable
          className="p-4 min-h-[200px] focus:outline-none rich-editor text-foreground 
                     [&:empty:before]:content-[attr(data-placeholder)] [&:empty:before]:text-muted-foreground [&:empty:before]:pointer-events-none
                     [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:my-4
                     [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:my-3
                     [&_h3]:text-xl [&_h3]:font-bold [&_h3]:my-3
                     [&_p]:my-2
                     [&_blockquote]:border-l-4 [&_blockquote]:border-muted [&_blockquote]:pl-4 [&_blockquote]:my-4 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
                     [&_ul]:my-2 [&_ul]:pl-8 [&_ol]:my-2 [&_ol]:pl-8
                     [&_li]:my-1
                     [&_a]:text-primary [&_a]:underline
                     [&_strong]:font-bold
                     [&_em]:italic
                     [&_u]:underline"
          dangerouslySetInnerHTML={{ __html: value }}
          onInput={handleInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onPaste={handlePaste}
          data-placeholder={placeholder}
        />
      </div>
    </div>
  );
}
