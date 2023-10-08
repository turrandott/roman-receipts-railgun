const Loading = () => {
  return (
    <div className="flex place-content-center items-center min-h-screen">
      <span className="relative flex h-10 w-10">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-10 w-10 bg-green-500"></span>
      </span>
    </div>
  );
};

export default Loading;
