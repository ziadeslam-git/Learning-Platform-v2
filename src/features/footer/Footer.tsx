export function Footer() {
  return (
    <footer className="w-full py-12 mt-20 border-t border-white/10 glass bg-black/40">
      <div className="max-w-7xl mx-auto px-4 md:px-8 text-center text-gray-400">
        <p className="mb-4">
          Enterprise Learning Platform &copy; {new Date().getFullYear()}
        </p>
        <div className="flex justify-center gap-6 text-sm">
          <a href="#" className="hover:text-orange-500 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-orange-500 transition-colors">Support</a>
        </div>
      </div>
    </footer>
  );
}
