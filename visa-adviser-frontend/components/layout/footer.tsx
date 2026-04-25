import { Globe2, Mail, Phone, Send } from "lucide-react";

export function Footer() {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white py-10 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100">
      <div className="container-shell grid gap-8 md:grid-cols-4">
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">About</h4>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
            Worldwide Visa Adviser and Business Promoter helps members grow globally with reliable support.
          </p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">Services</h4>
          <ul className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>Visa Consultancy</li>
            <li>Documentation</li>
            <li>Business Promotion</li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">Contact</h4>
          <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">support@worldwidevisaadviser.com</p>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">+92 300 0000000</p>
        </div>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-wide text-blue-700 dark:text-blue-400">Follow</h4>
          <div className="mt-3 flex items-center gap-3 text-slate-600 dark:text-slate-300">
            <Globe2 size={18} />
            <Send size={18} />
            <Mail size={18} />
            <Phone size={18} />
          </div>
          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">Terms | Privacy | Compliance</p>
        </div>
      </div>
    </footer>
  );
}
