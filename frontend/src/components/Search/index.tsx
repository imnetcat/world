import { Button, Col, Form, Input, Row } from 'antd';
import { QueryParams } from 'api/metaApi';

type OrderBy = QueryParams['orderBy'];

interface SearchProps {
	value?: OrderBy;
	onChange?: (value: string) => void;
	placeholder?: string;
}

const Search = ({ value, onChange, placeholder }: SearchProps): JSX.Element => {
	return (
		<Form
			initialValues={{ query: value }}
			onFinish={({ query }) => onChange?.(query)}
		>
			<Row style={{ flexWrap: 'nowrap' }}>
				<Col flex={1}>
					<Form.Item
						noStyle
						name="query"
						rules={[{ required: true }]}
					>
						<Input placeholder={placeholder} />
					</Form.Item>
				</Col>
				<Col>
					<Form.Item noStyle>
						<Button type="primary" htmlType="submit">
							Search
						</Button>
					</Form.Item>
				</Col>
			</Row>
		</Form>
	);
};

export default Search;
