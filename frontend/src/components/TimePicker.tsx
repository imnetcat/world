import {
	PickerProps,
	PickerTimeProps,
} from 'antd/es/date-picker/generatePicker';
import * as React from 'react';
import { Component } from 'react';
import DatePicker from './DatePicker';

export type TimePickerProps = Omit<PickerTimeProps<Date>, 'picker'>;

const TimePicker = React.forwardRef<
	Component<PickerProps<Date>, unknown, unknown> | null,
	TimePickerProps
>((props, ref) => {
	const disabledHours = new Array(24)
		.fill(0)
		.map((h, i) => i)
		.filter((i) => i < new Date().getHours());
	const disabledMinutes = new Array(60)
		.fill(0)
		.map((h, i) => i)
		.filter((i) => i < new Date().getMinutes() + 1);

	return (
		<DatePicker
			{...props}
			picker="time"
			mode={undefined}
			ref={ref}
			disabledHours={() => disabledHours}
			disabledMinutes={(hour) =>
				hour === new Date().getHours() ? disabledMinutes : []
			}
		/>
	);
});

TimePicker.displayName = 'TimePicker';

export default TimePicker;
