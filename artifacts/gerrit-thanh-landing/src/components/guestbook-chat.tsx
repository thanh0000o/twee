import { type FC, useEffect, useMemo, useRef, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { countGuestbookSmileys, getGuestbookSmileyError } from '@workspace/api-zod/guestbook-smileys';
import { GuestbookMessage } from './guestbook-message';
import { GuestbookSmileyPicker } from './guestbook-smiley-picker';
import '../styles/guestbook.css';
import {
  getListGuestbookEntriesQueryKey,
  useCreateGuestbookEntry,
  useListGuestbookEntries,
} from '@workspace/api-client-react';

// Alternate widely separated, vivid hues rather than a cluster of pinks/purples.
const NAME_COLORS = ['#003cff', '#ff2020', '#00b52b', '#ed00ce', '#ff7800', '#00a9c7', '#8a24ff', '#9d7800'];
const guestbookTime = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Europe/Brussels',
  year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', second: '2-digit',
  hourCycle: 'h23', timeZoneName: 'short',
});


/** The guestbook chat itself, shown in its own block on the blog+links page. */
export const GuestbookChat: FC = () => {
  const queryClient = useQueryClient();
  const listRef = useRef<HTMLDivElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [name, setName] = useState('');
  const [activeName, setActiveName] = useState('');
  const [message, setMessage] = useState('');
  const [insertError, setInsertError] = useState('');
  const [canScrollMessages, setCanScrollMessages] = useState(false);
  const smileyCount = countGuestbookSmileys(message);
  const smileyError = getGuestbookSmileyError(message);

  const { data: entries = [], isLoading, isError } = useListGuestbookEntries({
    query: {
      queryKey: getListGuestbookEntriesQueryKey(),
      refetchInterval: 5000,
    },
  });
  const createEntry = useCreateGuestbookEntry();

  // The API returns the newest message first, and the chat shows it on top.
  const chatEntries = entries;

  const nameColors = useMemo(() => {
    const colors = new Map<string, string>();
    // Assign by first appearance (oldest first) so new authors don't recolour
    // existing ones. Unlike name hashing, distinct authors use every hue before repeating.
    for (const entry of [...chatEntries].reverse()) {
      if (!colors.has(entry.name)) {
        colors.set(entry.name, NAME_COLORS[colors.size % NAME_COLORS.length]);
      }
    }
    return colors;
  }, [chatEntries]);

  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [chatEntries.length]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const updateScrollState = () => setCanScrollMessages(list.scrollHeight > list.clientHeight + 1);
    updateScrollState();
    const resizeObserver = new ResizeObserver(updateScrollState);
    const mutationObserver = new MutationObserver(updateScrollState);
    resizeObserver.observe(list);
    mutationObserver.observe(list, { childList: true, characterData: true, subtree: true });
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  const acceptName = () => {
    const cleanName = name.trim();
    if (cleanName) setActiveName(cleanName);
  };

  const insertSmiley = (smiley: string) => {
    const start = messageRef.current?.selectionStart ?? message.length;
    const end = messageRef.current?.selectionEnd ?? start;
    const before = message.slice(0, start);
    const after = message.slice(end);
    const insertion = `${before && !/\s$/.test(before) ? ' ' : ''}${smiley} `;
    const next = `${before}${insertion}${after}`;
    const error = getGuestbookSmileyError(next);
    if (error || next.length > 500) {
      setInsertError(error ?? 'Your message is full (500 characters max).');
      return;
    }
    setInsertError('');
    setMessage(next);
    requestAnimationFrame(() => {
      messageRef.current?.focus();
      messageRef.current?.setSelectionRange(start + insertion.length, start + insertion.length);
    });
  };

  const sendMessage = () => {
    const cleanMessage = message.trim();
    if (!activeName || !cleanMessage || smileyError || createEntry.isPending) return;

    createEntry.mutate(
      { data: { name: activeName, message: cleanMessage } },
      {
        onSuccess: () => {
          setMessage('');
          setInsertError('');
          queryClient.invalidateQueries({
            queryKey: getListGuestbookEntriesQueryKey(),
          });
        },
      },
    );
  };

  return (
    <section className="gb-chat" aria-label="guestbook chat">
      <div className="gb-chat-scrollwrap">
        <div ref={listRef} className="gb-chat-stream" aria-live="polite" tabIndex={0} aria-label="Guestbook message history">
          {isLoading && <p className="gb-system-line">connecting to guestbook...</p>}
          {isError && <p className="gb-system-line gb-error">could not load messages.</p>}
          {!isLoading && !isError && chatEntries.length === 0 && (
            <p className="gb-system-line">no messages yet. say hello :-)</p>
          )}

          {chatEntries.map((entry) => {
            const color = nameColors.get(entry.name);
            return (
              <p className="gb-chat-line" key={entry.id}>
                <time className="gb-chat-time" dateTime={entry.createdAt} title={entry.createdAt}>
                  {guestbookTime.format(new Date(entry.createdAt))}
                </time>{' '}
                <span className="gb-chat-text">
                  <span className="gb-chat-name" style={{ color }}>{entry.name}</span>
                  <span className="gb-colon">:</span>{' '}
                  <span className="gb-chat-message"><GuestbookMessage message={entry.message} /></span>
                </span>
              </p>
            );
          })}
        </div>
        {canScrollMessages && (
          <div className="gb-chat-scroll-arrows" role="group" aria-label="Scroll guestbook messages">
            <button type="button" className="gb-chat-scroll-arrow" aria-label="Scroll messages up"
              onClick={() => listRef.current?.scrollBy({ top: -48 })}>
              <span className="gb-chat-scroll-arrow-icon up" aria-hidden="true" />
            </button>
            <button type="button" className="gb-chat-scroll-arrow" aria-label="Scroll messages down"
              onClick={() => listRef.current?.scrollBy({ top: 48 })}>
              <span className="gb-chat-scroll-arrow-icon down" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className="gb-controls">
        <div className="gb-name-row">
          <label htmlFor="guestbook-name">name:</label>
          <input
            id="guestbook-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') acceptName();
            }}
            maxLength={30}
            disabled={Boolean(activeName)}
            placeholder="enter your name"
          />
          {activeName ? (
            <button type="button" onClick={() => setActiveName('')}>change</button>
          ) : (
            <button type="button" onClick={acceptName} disabled={!name.trim()}>ok</button>
          )}
        </div>

        <GuestbookSmileyPicker disabled={!activeName || createEntry.isPending}
          count={smileyCount} onInsert={insertSmiley} />

        <div className="gb-message-row">
          <textarea
            ref={messageRef}
            aria-label="Your guestbook message"
            aria-invalid={Boolean(smileyError)}
            aria-describedby={smileyError || insertError ? 'guestbook-smiley-error' : undefined}
            value={message}
            onChange={(event) => {
              setMessage(event.target.value);
              setInsertError('');
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                sendMessage();
              }
            }}
            maxLength={500}
            rows={3}
            disabled={!activeName || createEntry.isPending}
            placeholder={activeName ? 'write a message...' : 'enter your name first...'}
          />
          <button
            type="button"
            onClick={sendMessage}
            disabled={!activeName || !message.trim() || Boolean(smileyError) || createEntry.isPending}
          >
            {createEntry.isPending ? 'sending...' : 'send'}
          </button>
        </div>

        {(message.includes(':gb-') || /[\p{Extended_Pictographic}\p{Regional_Indicator}\u20e3]/u.test(message)) &&
          <div className="gb-message-preview" aria-label="Message preview">
          <span>preview: </span><GuestbookMessage message={message} />
        </div>}
        {(smileyError || insertError) && <p id="guestbook-smiley-error" className="gb-smiley-error" role="status">
          {smileyError || insertError}
        </p>}
        {createEntry.isError && (
          <p className="gb-post-error">message could not be sent.</p>
        )}
      </div>
    </section>
  );
};
