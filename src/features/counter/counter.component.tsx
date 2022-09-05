import React from "react";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { increment, decrement, reset, incrementByAmount } from "./conterSlice";

type Props = {};

const Counter = (props: Props) => {
  const dispatch = useAppDispatch();
  const count = useAppSelector((state) => state.counter.count);

  return (
    <section>
      <p>{count}</p>
      <div>
        <button onClick={() => dispatch(increment())}>+</button>

        <button onClick={() => dispatch(decrement())}>-</button>
        <br />
        <button onClick={() => dispatch(reset())}>Reset</button>
        <br />
        <button onClick={() => dispatch(incrementByAmount(5))}>Plus 5</button>
      </div>
    </section>
  );
};
export default Counter;
