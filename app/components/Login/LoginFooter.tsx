// components/Login/LoginFooter.tsx
'use client';

const LoginFooter = () => {
  return (
    <div className="text-center mt-8 space-y-2">
      <p className="text-sm text-slate-400">
        © 2026 OpsPortal. All rights reserved.
      </p>
      <div className="flex items-center justify-center gap-4 text-xs text-slate-500">
        <button className="hover:text-slate-300 transition-colors">Privacy Policy</button>
        <span>•</span>
        <button className="hover:text-slate-300 transition-colors">Terms of Service</button>
        <span>•</span>
        <button className="hover:text-slate-300 transition-colors">Contact Support</button>
      </div>
    </div>
  );
};

export default LoginFooter;