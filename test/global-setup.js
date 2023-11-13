import isPortReachable from "is-port-reachable";
import path from "path";
import dockerCompose from "docker-compose";

export default async () => {
  console.time('global-setup');

  const isDBReachable = await isPortReachable(54310);
  if (!isDBReachable) {
    await dockerCompose.upAll({
      cwd: path.join(__dirname),
      log: true,
    });

    await dockerCompose.exec(
      'database',
      ['sh', '-c', 'until pg_isready ; do sleep 1; done'],
      {
        cwd: path.join(__dirname),
      }
    );
  }

  // 👍🏼 We're ready
  console.timeEnd('global-setup');
};