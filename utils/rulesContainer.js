const {
    ContainerBuilder,
    TextDisplayBuilder,
    SeparatorBuilder,
    SeparatorSpacingSize
} = require("discord.js");

const config = require("../config");

function createRulesContainer() {
    const container = new ContainerBuilder();

    // Заголовок
    container.addTextDisplayComponents(
        new TextDisplayBuilder().setContent(
            config.rules.title
        )
    );

    // Разделитель
    container.addSeparatorComponents(
        new SeparatorBuilder()
            .setDivider(true)
            .setSpacing(SeparatorSpacingSize.Large)
    );

    // Правила из конфига
    config.rules.paragraphs.forEach((paragraph, index) => {
        container.addTextDisplayComponents(
            new TextDisplayBuilder().setContent(
                `${paragraph.title}\n${paragraph.text}`
            )
        );

        // Разделитель между правилами
        if (index < config.rules.paragraphs.length - 1) {
            container.addSeparatorComponents(
                new SeparatorBuilder()
                    .setDivider(true)
                    .setSpacing(SeparatorSpacingSize.Large)
            );
        }
    });

    return container;
}

module.exports = {
    createRulesContainer
};