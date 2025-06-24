import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ImSpinner2 } from 'react-icons/im';
import { BsFillExclamationDiamondFill } from 'react-icons/bs';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import supabase from '../../supabaseClient';

export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (loginError) {
        setError(loginError.message);
      } else {
        const { user } = data;
        const role = user.user_metadata?.role;

        if (role === 'admin') {
          navigate('/admin/dashboard');
        } else if (role === 'guest') {
          navigate('/guest/dashboard');
        } else {
          setError('Role tidak dikenali.');
        }
      }
    } catch {
      setError('Terjadi kesalahan saat login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 dark:from-gray-900 dark:to-black px-4">
      <div className="w-full max-w-lg bg-white/20 dark:bg-white/10 backdrop-blur-xl border border-white/30 rounded-2xl shadow-xl p-8 sm:p-10 md:p-12 transition-all duration-500">
        <h2 className="text-4xl font-bold text-center text-white mb-8 drop-shadow">
          Welcome Back 👋
        </h2>

        {/* Error Message */}
        {error && (
          <div className="flex items-center text-red-500 text-sm bg-red-100/80 dark:bg-red-500/10 rounded p-3 mb-4 shadow">
            <BsFillExclamationDiamondFill className="mr-2" />
            {error}
          </div>
        )}

        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center text-blue-600 text-sm bg-blue-100/80 dark:bg-blue-500/10 rounded p-3 mb-4 shadow">
            <ImSpinner2 className="mr-2 animate-spin" />
            Memproses login...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-sm text-white font-medium mb-1">Email Address</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-white/60">
                <FaEnvelope />
              </span>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-4 bg-white/10 dark:bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="you@example.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-white font-medium mb-1">Password</label>
            <div className="relative">
              <span className="absolute left-3 top-2.5 text-white/60">
                <FaLock />
              </span>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full py-2 pl-10 pr-4 bg-white/30 dark:bg-white/10 border border-white/30 rounded-lg text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="********"
                required
              />
            </div>
          </div>

          {/* Forgot Password */}
          <div className="text-right">
            <Link to="/forgot" className="text-sm text-white/70 hover:text-white hover:underline transition">
              Forgot Password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-xl font-semibold transition-transform transform hover:scale-105 shadow-lg"
          >
            {loading ? 'Loading...' : 'Log In'}
          </button>
        </form>

        {/* Register Link */}
        <div className="mt-6 text-center text-sm text-white/80">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="text-indigo-200 hover:underline">
              Register
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
