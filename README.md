MoKee CAF Tracker
==========

[![][npm-deps]][npm-deps-url] [![][npm-devDeps]][npm-deps-url] [![][docker-build]][docker-url] [![][docker-pulls]][docker-url] [![][ctbtors-img]][ctbtors-url]

Tracking CAF's tag releases

## Install

```sh
docker pull mokee/caf_tracker
```

_MySQL is required_

## Contribute

A [MoKee Code Review](https://mokeedev.review/) account is required.

```
git clone ssh://username@mokeedev.review:29418/MoKee/caf_tracker
cd caf_tracker
scp -p -P 29418 username@mokeedev.review:hooks/commit-msg .git/hooks/
```

```sh
npm install
npm run dev
```

```
git push origin HEAD:refs/for/master
```

## License

[GPL-3.0 License](LICENSE)

[npm-deps]: https://img.shields.io/david/MoKee/caf_tracker.svg?style=flat-square
[npm-devDeps]: https://img.shields.io/david/dev/MoKee/caf_tracker.svg?style=flat-square
[npm-deps-url]: packages.json
[docker-build]: https://img.shields.io/docker/build/mokee/caf_tracker.svg?style=flat-square
[docker-pulls]: https://img.shields.io/docker/pulls/mokee/caf_tracker.svg?style=flat-square
[docker-url]: https://hub.docker.com/r/mokee/caf_tracker/
[ctbtors-img]: https://img.shields.io/github/contributors/MoKee/caf_tracker.svg?style=flat-square
[ctbtors-url]: https://mokeedev.review/q/project:MoKee%252Fcaf_tracker
