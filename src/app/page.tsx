import Survey from '@/components/Survey';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-start justify-start px-4 pt-10 pb-16" style={{background: 'var(--background)'}}>
      <div className="w-full max-w-lg mx-auto">
        <Survey />
      </div>
    </main>
  );
}
