import React from "react";

const PageSkeleton = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#312C51]">
      <div className="animate-pulse w-11/12 max-w-md space-y-6">
        <div className="h-10 bg-[#3A345C] rounded-md w-2/3 mx-auto" />
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-8 bg-[#3A345C] rounded-md" />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageSkeleton;
