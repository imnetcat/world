import { Form, Select } from 'antd';
import { QueryParams } from 'api/metaApi';

type OrderBy = QueryParams['orderBy'];

interface SortProps {
	value?: OrderBy;
	onChange?: (value: OrderBy) => void;
	fields: string[];
}

const Sort = ({ value, onChange, fields }: SortProps): JSX.Element => {
	return (
		<Form
			layout="horizontal"
			onFieldsChange={(data) => console.log(data)}
			initialValues={value?.[0]} // TODO: Make for all fields, bot for first
		>
			<Form.Item
				label="Field"
				name="field"
				rules={[{ required: true, message: 'Field is required' }]}
			>
				<Select>
					{fields.map((field) => (
						<Select.Option key={field} value={field}>
							{field}
						</Select.Option>
					))}
				</Select>
			</Form.Item>
			<Form.Item
				style={{ margin: 0 }}
				label="Order"
				name="order"
				rules={[{ required: true, message: 'Order is required' }]}
			>
				<Select>
					<Select.Option key="descend" value="descend">
						Descend
					</Select.Option>
					<Select.Option key="ascend" value="ascend">
						Ascend
					</Select.Option>
				</Select>
			</Form.Item>
		</Form>
	);
};

export default Sort;
