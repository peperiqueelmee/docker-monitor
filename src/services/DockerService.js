const Docker = require('dockerode');

class DockerService {
  constructor() {
    this.docker = new Docker();
  }

  async getContainersState() {
    const containers = await this.docker.listContainers({ all: true });
    return containers.map(container => ({
      id: container.Id,
      name: container.Names[0].replace('/', ''),
      image: container.Image,
      state: container.State,
    }));
  }
}

module.exports = new DockerService();
