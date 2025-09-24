interface User {
  id: number;
  name: string;
  phone: string;
}

export default function ContactUsersPage() {
  // Données mockées en attendant une vraie DB
  const users: User[] = [
    { id: 1, name: "Alice", phone: "+229 61000000" },
    { id: 2, name: "Bob", phone: "+229 62000000" },
    { id: 3, name: "Charlie", phone: "+229 63000000" },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-4">📞 Numéros des utilisateurs</h2>
      <ul className="bg-white shadow rounded-xl divide-y">
        {users.map((user) => (
          <li key={user.id} className="p-4 flex justify-between">
            <span className="font-medium text-gray-700">{user.name}</span>
            <span className="text-blue-600">{user.phone}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

