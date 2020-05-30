[MoKee CAF Tracker](https://caf.mokeedev.com/)
==========

Tracking CAF's tag releases

## Develop

```
docker-compose up
```

## Contribute

As part of the MoKee Open Source Project, this repository accepts commits
from our [Gerrit Code Review](https://mokeedev.review/) platform.

```sh
# setup
scp -p -P 29418 YOURNAME@mokeedev.review:hooks/commit-msg $(git rev-parse --git-dir)/hooks/
git remote add review ssh://YOURNAME@mokeedev.review:29418/MoKee/caf_tracker

# submit
git push review HEAD:refs/for/master
```

## License

Apache License 2.0
