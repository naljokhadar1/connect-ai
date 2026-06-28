/* Connect AI — Assessment Preview: question-by-question review */

const MCQ = "mcq", CODE = "code", WRITTEN = "written";

export const ASSESSMENT_QUESTIONS = [
  /* ── Section 1: React Fundamentals (5 Qs) ── */
  {
    id: "q1", section: "React fundamentals", n: 1, type: MCQ, pts: 4, timeS: 48,
    topic: "Component lifecycle",
    q: "In React 18, which hook correctly replaces componentDidMount and componentWillUnmount in a functional component?",
    options: [
      { id: "a", text: "useEffect(() => { … }, []);", correct: true },
      { id: "b", text: "useCallback(() => { … }, []);", correct: false },
      { id: "c", text: "useMemo(() => { … }, []);", correct: false },
      { id: "d", text: "useLayoutEffect(() => { … });", correct: false },
    ],
    candidateAnswer: "a",
    scored: 4, maxScore: 4,
    aiNote: "Correct. Ahmed answered in 48s — well within median time of 82s for this question.",
    difficulty: "medium",
  },
  {
    id: "q2", section: "React fundamentals", n: 2, type: MCQ, pts: 4, timeS: 62,
    topic: "Rendering",
    q: "What does React.memo() do when the parent component re-renders?",
    options: [
      { id: "a", text: "It always re-renders the child component.", correct: false },
      { id: "b", text: "It skips re-rendering the child if its props have not changed (shallow comparison).", correct: true },
      { id: "c", text: "It deep-clones all props before each render.", correct: false },
      { id: "d", text: "It renders the child asynchronously using a web worker.", correct: false },
    ],
    candidateAnswer: "b",
    scored: 4, maxScore: 4,
    aiNote: "Correct. Ahmed selected the right answer without hesitation.",
    difficulty: "medium",
  },
  {
    id: "q3", section: "React fundamentals", n: 3, type: MCQ, pts: 4, timeS: 74,
    topic: "Hooks",
    q: "You have a counter stored in a ref: const count = useRef(0). After count.current++, what happens in the UI?",
    options: [
      { id: "a", text: "The component re-renders immediately.", correct: false },
      { id: "b", text: "The component re-renders after 300ms debounce.", correct: false },
      { id: "c", text: "The component does NOT re-render; refs do not trigger renders.", correct: true },
      { id: "d", text: "React throws an error because you modified ref.current.", correct: false },
    ],
    candidateAnswer: "c",
    scored: 4, maxScore: 4,
    aiNote: "Correct. Key ref vs state distinction — Ahmed knows this well.",
    difficulty: "medium",
  },
  {
    id: "q4", section: "React fundamentals", n: 4, type: CODE, pts: 4, timeS: 210,
    topic: "Custom hooks",
    q: "Write a custom hook useWindowWidth() that returns the current window width and updates whenever the window is resized.",
    codeAnswer: `function useWindowWidth() {
  const [width, setWidth] = React.useState(window.innerWidth);

  React.useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  return width;
}`,
    modelAnswer: `function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
}`,
    scored: 4, maxScore: 4,
    aiNote: "Full marks. Ahmed correctly cleans up the event listener in the return function and initializes from window.innerWidth. Code is clean and idiomatic.",
    difficulty: "medium",
  },
  {
    id: "q5", section: "React fundamentals", n: 5, type: MCQ, pts: 4, timeS: 38,
    topic: "Concurrent features",
    q: "What is the primary purpose of React.Suspense?",
    options: [
      { id: "a", text: "To catch JavaScript errors in any child component tree.", correct: false },
      { id: "b", text: "To specify a fallback UI while waiting for lazy-loaded components or async data.", correct: true },
      { id: "c", text: "To suspend all state updates until the next render cycle.", correct: false },
      { id: "d", text: "To prevent re-rendering during user interactions.", correct: false },
    ],
    candidateAnswer: "b",
    scored: 4, maxScore: 4,
    aiNote: "Correct.",
    difficulty: "easy",
  },

  /* ── Section 2: TypeScript (5 Qs) ── */
  {
    id: "q6", section: "TypeScript types", n: 6, type: MCQ, pts: 4, timeS: 55,
    topic: "Generics",
    q: "What is the output type of the following: type Readonly<T> = { readonly [K in keyof T]: T[K] }; type Result = Readonly<{ a: string; b: number }>;",
    options: [
      { id: "a", text: "{ a: string; b: number }", correct: false },
      { id: "b", text: "{ readonly a: string; readonly b: number }", correct: true },
      { id: "c", text: "Readonly<string | number>", correct: false },
      { id: "d", text: "TypeScript would throw a type error.", correct: false },
    ],
    candidateAnswer: "b",
    scored: 4, maxScore: 4,
    aiNote: "Correct. Strong mapped types understanding.",
    difficulty: "hard",
  },
  {
    id: "q7", section: "TypeScript types", n: 7, type: MCQ, pts: 4, timeS: 78,
    topic: "Utility types",
    q: "Which TypeScript utility type makes all properties of T optional?",
    options: [
      { id: "a", text: "Required<T>", correct: false },
      { id: "b", text: "Partial<T>", correct: true },
      { id: "c", text: "Pick<T, K>", correct: false },
      { id: "d", text: "Omit<T, K>", correct: false },
    ],
    candidateAnswer: "b",
    scored: 4, maxScore: 4,
    aiNote: "Correct.",
    difficulty: "easy",
  },
  {
    id: "q8", section: "TypeScript types", n: 8, type: CODE, pts: 4, timeS: 285,
    topic: "Generic constraints",
    q: "Write a generic function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] that safely accesses a property of an object.",
    codeAnswer: `function getProperty<T, K extends keyof T>(
  obj: T,
  key: K
): T[K] {
  return obj[key];
}`,
    modelAnswer: `function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}`,
    scored: 4, maxScore: 4,
    aiNote: "Perfect. Ahmed typed this quickly and correctly, showing familiarity with keyof and indexed access types.",
    difficulty: "medium",
  },
  {
    id: "q9", section: "TypeScript types", n: 9, type: MCQ, pts: 4, timeS: 102,
    topic: "Discriminated unions",
    q: "Which pattern is a TypeScript 'discriminated union'?",
    options: [
      { id: "a", text: "type A = string | number", correct: false },
      { id: "b", text: "type Shape = { kind: 'circle'; radius: number } | { kind: 'square'; side: number }", correct: true },
      { id: "c", text: "interface A extends B { }", correct: false },
      { id: "d", text: "type A = { [key: string]: any }", correct: false },
    ],
    candidateAnswer: "b",
    scored: 4, maxScore: 4,
    aiNote: "Correct. Discriminated unions are a core pattern for typed state machines.",
    difficulty: "medium",
  },
  {
    id: "q10", section: "TypeScript types", n: 10, type: MCQ, pts: 4, timeS: 88,
    topic: "Type narrowing",
    q: "After the check if (typeof x === 'string'), inside the block TypeScript infers x as:",
    options: [
      { id: "a", text: "unknown", correct: false },
      { id: "b", text: "string | undefined", correct: false },
      { id: "c", text: "string", correct: true },
      { id: "d", text: "The original union type, unchanged.", correct: false },
    ],
    candidateAnswer: "c",
    scored: 4, maxScore: 4,
    aiNote: "Correct. Type narrowing fundamental.",
    difficulty: "easy",
  },

  /* ── Section 3: State management ── */
  {
    id: "q11", section: "State management", n: 11, type: MCQ, pts: 4, timeS: 95,
    topic: "Redux selectors",
    q: "In Redux Toolkit, what is the main benefit of using createSelector from reselect?",
    options: [
      { id: "a", text: "It automatically dispatches actions on component mount.", correct: false },
      { id: "b", text: "It memoizes selector results so derived data is only recalculated when input selectors change.", correct: true },
      { id: "c", text: "It replaces the Redux store with a local context.", correct: false },
      { id: "d", text: "It converts sagas to thunks automatically.", correct: false },
    ],
    candidateAnswer: "b",
    scored: 4, maxScore: 4,
    aiNote: "Correct.",
    difficulty: "medium",
  },
  {
    id: "q12", section: "State management", n: 12, type: CODE, pts: 4, timeS: 412,
    topic: "Redux slice",
    q: "Write a Redux Toolkit slice for a simple counter with increment, decrement, and reset actions.",
    codeAnswer: `import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: { value: 0 },
  reducers: {
    increment: (state) => { state.value += 1; },
    decrement: (state) => { state.value -= 1; },
    reset: (state) => { state.value = 0; },
  },
});

export const { increment, decrement, reset } = counterSlice.actions;
export default counterSlice.reducer;`,
    modelAnswer: `// Same structure expected`,
    scored: 4, maxScore: 4,
    aiNote: "Correct and clean. Ahmed uses Immer mutation syntax (state.value +=) correctly. Full marks.",
    difficulty: "medium",
  },
  {
    id: "q13", section: "State management", n: 13, type: MCQ, pts: 4, timeS: 480,
    topic: "Async patterns",
    q: "When should you prefer Zustand over Redux Toolkit for state management in a React app?",
    options: [
      { id: "a", text: "When you need strict unidirectional data flow and time-travel debugging.", correct: false },
      { id: "b", text: "When the app is small-to-medium, team prefers minimal boilerplate, and you don't need Redux DevTools integration.", correct: true },
      { id: "c", text: "When you need server-side rendering with Next.js.", correct: false },
      { id: "d", text: "Zustand cannot be used with React — it is a Vue library.", correct: false },
    ],
    candidateAnswer: "a",
    scored: 0, maxScore: 4,
    aiNote: "Incorrect. Ahmed selected option A (Redux benefits) when the question asked when to prefer Zustand. He may have misread the question. The correct answer is B. This is the only MCQ he got wrong.",
    difficulty: "hard",
  },
  {
    id: "q14", section: "State management", n: 14, type: MCQ, pts: 4, timeS: 390,
    topic: "Context API",
    q: "What is the main performance concern with React Context for state management?",
    options: [
      { id: "a", text: "Context is synchronous only — async updates are not supported.", correct: false },
      { id: "b", text: "All consumers re-render whenever the context value changes, even if they only use a subset of the data.", correct: true },
      { id: "c", text: "Context values cannot be objects — only primitives are allowed.", correct: false },
      { id: "d", text: "Context is deprecated in React 18.", correct: false },
    ],
    candidateAnswer: "b",
    scored: 4, maxScore: 4,
    aiNote: "Correct. Aware of context re-render pitfalls — good sign for senior-level work.",
    difficulty: "medium",
  },
  {
    id: "q15", section: "State management", n: 15, type: WRITTEN, pts: 4, timeS: 310,
    topic: "Architecture",
    q: "In 2–3 sentences, describe how you would structure client state vs server state in a large React application, and which libraries you would use.",
    writtenAnswer: "I'd use React Query (TanStack Query) for all server state — it handles caching, background refetching, and stale-while-revalidate out of the box. For client-only UI state (modals, form state, theme), I'd use Zustand for global state and useState/useReducer locally. I'd avoid putting server data in Redux or Zustand as it duplicates the cache and leads to stale data bugs.",
    scored: 4, maxScore: 4,
    aiNote: "Excellent answer. Ahmed correctly distinguishes server vs client state, names appropriate tools, and explains the failure mode of mixing them. This answer is better than most senior candidates.",
    difficulty: "hard",
  },
  {
    id: "q16", section: "State management", n: 16, type: MCQ, pts: 4, timeS: 95,
    topic: "Immutability",
    q: "In Redux Toolkit's createSlice, why can you write state.value = newValue directly inside a reducer?",
    options: [
      { id: "a", text: "Redux Toolkit uses Immer under the hood, which tracks mutations and produces a new immutable state.", correct: true },
      { id: "b", text: "Redux Toolkit uses Vue's reactivity system for state tracking.", correct: false },
      { id: "c", text: "JavaScript objects are always mutated by reference in Redux.", correct: false },
      { id: "d", text: "createSlice disables TypeScript strict mode inside reducers.", correct: false },
    ],
    candidateAnswer: "a",
    scored: 4, maxScore: 4,
    aiNote: "Correct. Immer knowledge confirmed.",
    difficulty: "medium",
  },

  /* ── Sections 4 & 5 ── */
  {
    id: "q17", section: "Performance", n: 17, type: MCQ, pts: 4, timeS: 88,
    topic: "Lazy loading",
    q: "Which React API enables code-splitting at the component level?",
    options: [
      { id: "a", text: "React.Fragment", correct: false },
      { id: "b", text: "React.lazy() + Suspense", correct: true },
      { id: "c", text: "React.createPortal()", correct: false },
      { id: "d", text: "React.StrictMode", correct: false },
    ],
    candidateAnswer: "b",
    scored: 4, maxScore: 4, aiNote: "Correct.", difficulty: "easy",
  },
  {
    id: "q18", section: "Performance", n: 18, type: MCQ, pts: 4, timeS: 124,
    topic: "Core Web Vitals",
    q: "Which metric measures the time from when a user first interacts with the page to when the browser responds?",
    options: [
      { id: "a", text: "Largest Contentful Paint (LCP)", correct: false },
      { id: "b", text: "Cumulative Layout Shift (CLS)", correct: false },
      { id: "c", text: "First Input Delay (FID) / Interaction to Next Paint (INP)", correct: true },
      { id: "d", text: "Time to First Byte (TTFB)", correct: false },
    ],
    candidateAnswer: "c",
    scored: 4, maxScore: 4, aiNote: "Correct.", difficulty: "medium",
  },
  {
    id: "q19", section: "Accessibility", n: 19, type: MCQ, pts: 4, timeS: 76,
    topic: "ARIA",
    q: "When should you use aria-label vs aria-labelledby?",
    options: [
      { id: "a", text: "aria-label provides a string directly; aria-labelledby references the ID of another element that provides the label.", correct: true },
      { id: "b", text: "They are identical — use either interchangeably.", correct: false },
      { id: "c", text: "aria-labelledby is for buttons; aria-label is for inputs.", correct: false },
      { id: "d", text: "aria-label is deprecated — use aria-labelledby always.", correct: false },
    ],
    candidateAnswer: "a",
    scored: 4, maxScore: 4, aiNote: "Correct.", difficulty: "medium",
  },
  {
    id: "q20", section: "Accessibility", n: 20, type: MCQ, pts: 4, timeS: 62,
    topic: "Keyboard nav",
    q: "What is the correct way to make a custom div-based button keyboard accessible?",
    options: [
      { id: "a", text: "Add tabIndex='0' and onKeyDown handler for Enter/Space.", correct: true },
      { id: "b", text: "Add onFocus and onChange handlers.", correct: false },
      { id: "c", text: "Wrap it in a <form> element.", correct: false },
      { id: "d", text: "Add aria-disabled='false'.", correct: false },
    ],
    candidateAnswer: "a",
    scored: 4, maxScore: 4, aiNote: "Correct.", difficulty: "medium",
  },
];

export const ASSESSMENT_META = {
  name: "Frontend Engineering Skills Assessment",
  candidate: "Ahmed Hassan",
  jobTitle: "Senior Frontend Engineer",
  sentDate: "June 5, 2026",
  completedDate: "June 6, 2026",
  timeTaken: "26 minutes",
  timeLimit: "45 minutes",
  totalScore: 76,
  maxTotal: 80,
  pct: 95,
  tier: "Strong",
  topPct: 8,
  totalQ: 20,
  sections: ["React fundamentals","TypeScript types","State management","Performance","Accessibility"],
};

window.ASSESSMENT_QUESTIONS = ASSESSMENT_QUESTIONS;
window.ASSESSMENT_META = ASSESSMENT_META;
