"use client";
import React from "react";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "../redux/store";
import Counter from "@/components/Counter";

const App: React.FC = () => {
  return (
    <html>
      <body>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            {/* Your application components */}
            <Counter />
          </PersistGate>
        </Provider>
      </body>
    </html>
  );
};
export default App;
