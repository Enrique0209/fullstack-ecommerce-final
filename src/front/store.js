export const initialStore = () => {
    return {
        message: null,
        todos: [],
        products: [],
        user: JSON.parse(localStorage.getItem("user")) || null,
        token: localStorage.getItem("token") || null,
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
    localStorage.setItem("token", action.payload.token)
    localStorage.setItem("user", JSON.stringify(action.payload.user))
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
    return store;
}
}
