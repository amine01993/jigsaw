import classNames from "classnames";
import * as motion from "motion/react-client";
import { memo, useCallback, useState } from "react";

interface InputSwitchProps {
    name: string;
    value?: boolean;
    onChange?: (value: boolean) => void;
}

const InputSwitch = ({ name, value, onChange }: InputSwitchProps) => {
    const [isOn, setIsOn] = useState(value || false);

    const toggleSwitch = useCallback(() => {
        console.log("InputSwitch toggled");
        setIsOn((prev) => !prev);
        onChange?.(!isOn);
    }, [isOn]);

    const handleChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = event.target.checked;
        setIsOn(newValue);
        onChange?.(newValue);
    }, []);

    console.log("InputSwitch rendered");

    return (
        <>
            <input
                type="checkbox"
                name={name}
                id={name}
                checked={isOn}
                onChange={handleChange}
                className="hidden"
            />
            <button
                className={classNames(
                    "flex items-center w-20 h-10 p-1.5 rounded-2xl bg-[#FFD6C1] hover:bg-[#ffbb99] transition-colors duration-300 cursor-pointer",
                    {
                        "justify-start": isOn,
                        "justify-end": !isOn,
                    }
                )}
                onClick={toggleSwitch}
            >
                <motion.div
                    className={classNames(
                        "size-7 rounded-[calc(var(--radius-2xl)-(var(--spacing)*1.5))] shadow-md transition-colors duration-300",
                        {
                            "bg-[#b33b00]": isOn,
                            "bg-white": !isOn,
                        }
                    )}
                    layout
                    transition={{
                        type: "spring",
                        visualDuration: 0.3,
                        bounce: 0.3,
                    }}
                />
            </button>
        </>
    );
};

export default memo(InputSwitch);
