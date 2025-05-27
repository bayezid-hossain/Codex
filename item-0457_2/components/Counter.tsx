"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/redux/rootReducer";
import { INCREMENT, DECREMENT } from "@/redux/actions";

export default function Counter() {
  const count =
    useSelector(
      (state: RootState) => state?.counter?.data?.count
    ) ?? 0;
  const dispatch = useDispatch();

  return (
    <div className="flex flex-col items-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Count: {count}</h1>
      <div className="flex gap-2">
        <button
          onClick={() => dispatch({ type: INCREMENT })}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          Increment
        </button>
        <button
          onClick={() => dispatch({ type: DECREMENT })}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          Decrement
        </button>
      </div>
    </div>
  );
}
