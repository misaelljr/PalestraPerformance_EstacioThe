from locust import HttpUser, TaskSet, task, between

class UserBehavior(TaskSet):
    @task
    def criar_usuario(self):
        payload = {
            'username': 'testuser',
            'password': 'testpassword',
            'email': 'testuser@example.com'
        }
        headers = {'Content-Type': 'application/json'}
        response = self.client.post('/user', json=payload, headers=headers)
        assert response.status_code == 200

    @task
    def fazer_login(self):
        username = 'testuser'
        password = 'testpassword'
        params = {
            'username': username,
            'password': password,
        }
        headers = {'Content-Type': 'application/json'}
        response = self.client.get('/user/login', params=params, headers=headers)
        assert response.status_code == 200

    @task
    def obter_informacoes_usuario(self):
        username = 'testuser'
        headers = {'Content-Type': 'application/json'}
        response = self.client.get(f'/user/{username}', headers=headers)
        assert response.status_code == 200
        
class WebsiteUser(HttpUser):
    tasks = [UserBehavior]
    wait_time = between(1, 3)