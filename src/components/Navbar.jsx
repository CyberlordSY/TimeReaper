export default function Navbar() {
  return (
    <nav className="flex sticky top-0 justify-between bg-[#1f1f1f] text-white p-2 shadow z-50">
      <div className="logo">
        <span className="font-bold text-xl mx-8">TimeReaper</span>
      </div>
      <ul className="flex gap-8 mx-9">
        <li className="cursor-pointer hover:underline transition-all">Home</li>
      </ul>
    </nav>
  );
}
