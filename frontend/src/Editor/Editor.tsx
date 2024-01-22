import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
} from 'lexical';
import clsx from 'clsx';
import React from 'react';
import { mergeRegister } from '@lexical/utils';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';


function onChange(state) {
  state.read(() => {
    const root = $getRoot();
    const selection = $getSelection();

    console.log(selection);
  });
}

export const Editor = () => {
  const initialConfig = {};

  return (
    <div className="bg-white relative rounded-sm shadow-sm border border-gray-200">
      <LexicalComposer
        initialConfig={{
          theme: {
            // ltr: 'ltr',
            // rtl: 'rtl',
            paragraph: 'mb-1',
            rtl: 'text-right',
            ltr: 'text-left',
            text: {
              bold: 'font-bold',
              italic: 'italic',
              underline: 'underline',
              strikethrough: 'line-through',
            },
          },
          onError(error) {
            throw error;
          },
        }}
      >
        <Toolbar />
        <RichTextPlugin
          contentEditable={
            <ContentEditable className="min-h-[450px] outline-none py-[15px] px-2.5 resize-none overflow-hidden text-ellipsis" />
          }
          placeholder={
            <div className="absolute top-[15px] left-[10px] pointer-events-none select-none">
              Enter some text...
            </div>
          }
        />
        <OnChangePlugin onChange={onChange} />
        <HistoryPlugin />
      </LexicalComposer>
    </div>
  );
};

const Toolbar = () => {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = React.useState(false);
  const [isItalic, setIsItalic] = React.useState(false);
  const [isStrikethrough, setIsStrikethrough] = React.useState(false);
  const [isUnderline, setIsUnderline] = React.useState(false);

  const updateToolbar = React.useCallback(() => {
    const selection = $getSelection();

    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsStrikethrough(selection.hasFormat('strikethrough'));
      setIsUnderline(selection.hasFormat('underline'));
    }
  }, [editor]);

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      })
    );
  }, [updateToolbar, editor]);

  return (
    <div className="absolute z-20 text-white shadow bottom-8 left-1/2 transform -translate-x-1/2 min-w-52 h-10 px-2 py-2 bg-[#1b2733] mb-4 space-x-2 flex items-center">
      <button
        className={clsx(
          'px-1 hover:bg-gray-700 transition-colors duration-100 ease-in',
          isBold ? 'bg-gray-700' : 'bg-transparent'
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
        }}
      >
        <span className='font-extrabold text-sm text-white'>B</span>
      </button>
      <button
        className={clsx(
          'px-1 hover:bg-gray-700 transition-colors duration-100 ease-in',
          isStrikethrough ? 'bg-gray-700' : 'bg-transparent'
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'strikethrough');
        }}
      >
        <span className='font-extrabold text-sm text-white line-through'>U</span>

      </button>
      <button
        className={clsx(
          'px-1 hover:bg-gray-700 transition-colors duration-100 ease-in',
          isItalic ? 'bg-gray-700' : 'bg-transparent'
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
        }}
      >
        <span className='font-extrabold text-sm text-white italic'>I</span>
      </button>
      <button
        className={clsx(
          'px-1 hover:bg-gray-700 transition-colors duration-100 ease-in',
          isUnderline ? 'bg-gray-700' : 'bg-transparent'
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
        }}
      >
        <span className='font-extrabold text-sm text-white underline underline-offset-2'>U</span>
      </button>

      <span className="w-[1px] bg-gray-600 block h-full"></span>

      <button
        className={clsx(
          'px-1 bg-transparent hover:bg-gray-700 transition-colors duration-100 ease-in'
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'left');
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
        </svg>
      </button>
      <button
        className={clsx(
          'px-1 bg-transparent hover:bg-gray-700 transition-colors duration-100 ease-in'
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'center');
        }}
      >

      </button>
      <button
        className={clsx(
          'px-1 bg-transparent hover:bg-gray-700 transition-colors duration-100 ease-in'
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'right');
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" />
        </svg>
      </button>
      <button
        className={clsx(
          'px-1 bg-transparent hover:bg-gray-700 transition-colors duration-100 ease-in'
        )}
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, 'justify');
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
        </svg>
      </button>

      <span className="w-[1px] bg-gray-600 block h-full"></span>

      <button
        className={clsx(
          'px-1 bg-transparent hover:bg-gray-700 transition-colors duration-100 ease-in'
        )}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
        </svg>
      </button>
      <button
        className={clsx(
          'px-1 bg-transparent hover:bg-gray-700 transition-colors duration-100 ease-in'
        )}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND);
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="m15 15 6-6m0 0-6-6m6 6H9a6 6 0 0 0 0 12h3" />
        </svg>
      </button>
    </div>
  );
};
