import { useState } from "react";
import {
  FiCheckCircle,
  FiHelpCircle,
  FiMessageSquare,
  FiSend,
} from "react-icons/fi";

const FAQTrainer = () => {
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        "https://bewnet.pythonanywhere.com/api/faq/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        },
      );

      if (!response.ok) throw new Error("Training failed");
      setShowSuccess(true);
      setFormData({ question: "", answer: "" });
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to train the AI",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-[800px] space-y-4 p-1">
      <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08)]">
        <div className="p-8 md:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <FiHelpCircle className="mb-3 h-10 w-10 text-emerald-600" />
            <h2 className="text-3xl font-bold text-slate-900">Teach Our AI</h2>
            <p className="mt-1 text-sm text-slate-500">
              Add new questions and answers to improve our assistant
            </p>
          </div>

          {errorMessage ? (
            <div className="mb-5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700">
              {errorMessage}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                className="mb-2 block text-sm font-semibold text-slate-700"
                htmlFor="question"
              >
                Question
              </label>
              <div className="relative">
                <FiMessageSquare className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                <input
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  placeholder="What would users ask ?"
                  className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-3 text-sm text-slate-800 outline-none ring-emerald-400 transition focus:ring"
                  required
                />
              </div>
            </div>

            <div>
              <label
                className="mb-2 block text-sm font-semibold text-slate-700"
                htmlFor="answer"
              >
                Answer
              </label>
              <textarea
                id="answer"
                name="answer"
                value={formData.answer}
                onChange={handleChange}
                rows={5}
                placeholder="How should the AI respond ?"
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-800 outline-none ring-emerald-400 transition focus:ring"
                required
              />
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-12 items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 px-8 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
              >
                <FiSend />
                {isSubmitting ? "Teaching AI..." : "Train Knowledge Base"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {showSuccess ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white shadow-2xl">
            <div className="flex items-center gap-2 rounded-t-2xl bg-emerald-600 px-4 py-3 text-white">
              <FiCheckCircle className="h-5 w-5" />
              <p className="font-semibold">Knowledge Added!</p>
            </div>

            <div className="space-y-3 px-4 py-6 text-center">
              <FiCheckCircle className="mx-auto h-12 w-12 text-emerald-600" />
              <h3 className="text-lg font-semibold text-slate-900">
                Training Successful
              </h3>
              <p className="text-sm text-slate-600">
                The AI assistant has learned this new information and will now
                be able to answer similar questions.
              </p>
            </div>

            <div className="px-4 pb-4">
              <button
                type="button"
                onClick={() => setShowSuccess(false)}
                className="w-full rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
              >
                Continue Teaching
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default FAQTrainer;
