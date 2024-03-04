FROM node:20.11

LABEL name="Expo for Docker"

RUN npm install --global --unsafe-perm sharp-cli expo-cli@ && npm cache clean --force

COPY --chmod=777 entrypoint.sh /

ENTRYPOINT ["/entrypoint.sh"]
CMD ["--help"]
