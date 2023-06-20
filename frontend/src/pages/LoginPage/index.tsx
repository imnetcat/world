import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { Button, Form, Input, message } from 'antd';
import { useHistory } from 'react-router-dom';
import { useSignInMutation } from 'app/hooks';
import styles from './LoginPage.module.scss';

export const LoginPage = (): JSX.Element => {
	const [signIn] = useSignInMutation();
	const history = useHistory();

	return (
		<div className={styles.loginBox}>
			<Form
				onFinish={(values) =>
					void signIn(values).then((result) => {
						if ('error' in result) {
							const err = result.error as Error;
							message.error(err.message);
							return;
						}
						localStorage.setItem('token', result.data.token);
						history.push('/');
					})
				}
			>
				<Form.Item name="login" rules={[{ required: true }]}>
					<Input size="large" placeholder="Enter login" />
				</Form.Item>
				<Form.Item name="password" rules={[{ required: true }]}>
					<Input.Password
						size="large"
						placeholder="Enter password"
						iconRender={(visible) =>
							visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
						}
					/>
				</Form.Item>
				<Form.Item>
					<Button
						className={styles.submit}
						type="primary"
						htmlType="submit"
						size="large"
					>
						Enter
					</Button>
				</Form.Item>
			</Form>
		</div>
	);
};

export default LoginPage;
