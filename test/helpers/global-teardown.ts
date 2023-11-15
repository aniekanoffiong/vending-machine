import dockerCompose from "docker-compose";

export default async (): Promise<void> => {
    dockerCompose.down();
};