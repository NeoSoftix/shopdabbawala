import { motion } from "framer-motion";

/**
 * Step 2 ("create" mode only): hosts the caller-supplied customization
 * content, passed in as `children` (a render-prop function or plain node).
 */
export default function CustomizeStep({ onSubmit, children, goBack, loading, error }) {
  return (
    <motion.form
      key="customization"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      onSubmit={onSubmit}
      className="flex flex-col h-full"
    >
      <div className="flex-1 min-h-0 overflow-y-auto px-1 pb-4">
        {typeof children === "function"
          ? children({ goBack, loading, error })
          : children}
      </div>
    </motion.form>
  );
}
