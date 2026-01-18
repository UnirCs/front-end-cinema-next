// Server Component - Wrapper para el layout principal con Tailwind

const MainLayoutWrapper = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-cinema-dark text-cinema-text">
      {children}
    </div>
  );
};

export default MainLayoutWrapper;
