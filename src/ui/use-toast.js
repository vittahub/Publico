import * as React from "react";

const TOAST_LIMIT = 1;
const TOAST_REMOVE_DELAY = 1000000;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

const toastTimeouts = new Map();

const addToRemoveQueue = (toastId) => {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: "REMOVE_TOAST",
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

export const reducer = (state, action) => {
  switch (action.type) {
    case "ADD_TOAST":
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case "UPDATE_TOAST":
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case "DISMISS_TOAST":
      const { toastId } = action;
      // ! Side effects ! - This means you'll need to be careful if you're calling this in an effect
      addToRemoveQueue(toastId);
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId ? { ...t, open: false } : t
        ),
      };

    case "REMOVE_TOAST":
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
    default:
      return state;
  }
};

const listeners = [];

let state = {
  toasts: [],
};

function dispatch(action) {
  state = reducer(state, action);
  listeners.forEach((listener) => {
    listener(state);
  });
}

function useToast() {
  const [toastState, setToastState] = React.useState(state);

  React.useEffect(() => {
    const listener = (updatedState) => {
      setToastState(updatedState);
    };

    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, []);

  return {
    ...toastState,
    toast: React.useCallback((props) => {
      const id = genId();
      const update = (props) =>
        dispatch({
          type: "UPDATE_TOAST",
          toast: { ...props, id },
        });
      const dismiss = () => dispatch({ type: "DISMISS_TOAST", toastId: id });
      dispatch({
        type: "ADD_TOAST",
        toast: {
          ...props,
          id,
          open: true,
          onOpenChange: (open) => {
            if (!open) dismiss();
          },
        },
      });
      return {
        id: id,
        dismiss,
        update,
      };
    }, []),
  };
}

export { useToast, reducer };
