// components/ProfileCard.tsx
export function ProfileCard({ username, email }: { username: string; email: string }) {
  return (
    <div className="flex flex-col items-center my-8 w-full">
      <h2 className="mt-4 text-xl font-bold text-gray-800">{username}</h2>
      <p className="text-sm text-gray-500">{email}</p>
    </div>
  );
}
