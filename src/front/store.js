export const initialStore = () => {
  return {
    message: null,
    todos: [],
    products: [],
    user: null,
    token: null,
    cart: [],
  };
};

export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case "set_products":
      return {
        ...store,
        products: action.payload,
      };

    case "set_user":
      return {
        ...store,
        user: action.payload.user,
        token: action.payload.token,
      };

    case "set_cart":
      return {
        ...store,
        cart: action.payload,
      };

    

    case "add_task":
      const { id, color } = action.payload;

      return {
        ...store,
        todos: store.todos.map((todo) =>
          todo.id === id ? { ...todo, background: color } : todo,
        ),
      };
    default:
      throw Error("Unknown action.");
  }
}
