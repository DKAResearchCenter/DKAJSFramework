import gpio from "gpio";
import ansiColors from "ansi-colors";

const Options = {
    /**
     * @type {JSON}
     */
    SERVER_CONFIG : {},


    SERVER_STATE_DEVELOPMENT : "dev",
    SERVER_STATE_PRODUCTION : "prod",

    HTTP2_CORE_ENGINE : 1,
    EXPRESS_CORE_ENGINE : 2,
    FASTIFY_CORE_ENGINE : 3,
    RESTIFY_CORE_ENGINE : 4,
    REACTJS_CORE_ENGINE : 5,
    PHP_CORE_ENGINE : 6,
    PERL_CORE_ENGINE : 7,
    ANGULAR_CORE_ENGINE : 8,
    EXPO_CORE_ENGINE : 9,

    VIEW_POV_EJS : 1,
    VIEW_POV_MUSTACHE : 2,

    HOST_LOCALHOST : 1,

    FIREWALL_NAT_SRC : "srcnat",
    FIREWALL_NAT_DST : "dstnat",

    MARIADB_TYPE_DATA_BIGINT : "BIGINT",
    MARIADB_TYPE_DATA_LONGTEXT : "LONGTEXT",
    MARIADB_TYPE_DATA_INT : "INT",
    MARIADB_TYPE_DATA_BLOB : "BLOB",

    MARIADB_OPT_AUTO_INCREMENT : "AUTO_INCREMENT",
    MARIADB_OPT_AUTO_PRIMARY_KEY : "PRIMARY KEY",

    MARIADB_CREATECONNECTION : 1,
    MARIADB_POOL_CLUSTER : 2,
    MARIADB_POOL : 3,

    ENGINE_PDFKIT : "PDF_KIT_ENGINE",
    PAPER_SIZE_A4 : "A4",

    READY_STATE : `${ansiColors.blue('Ready')}`,
    LOADING_STATE : `${ansiColors.blue('Loading')}`,
    LOADED_STATE : `${ansiColors.green('Loaded')}`,
    COMPLETE_STATE : `${ansiColors.green('Complete')}`,
    START_STATE : `${ansiColors.green('Start')}`,
    STOP_STATE : `${ansiColors.red('Stop')}`,
    ERROR_STATE : `${ansiColors.red('Error')}`,
    WARNING_STATE : `${ansiColors.bgYellow('Warning')}`,

    DELAY_TIME : 10,

    RASPBERRYPI_CORE_CLI : "native",
    RASPBERRY_CORE_GPIO : "gpio",

    GPIO_DIR_OUT : gpio.DIRECTION.OUT,
    GPIO_DIR_HIGH : gpio.DIRECTION.HIGH,
    GPIO_DIR_IN : gpio.DIRECTION.IN,
    GPIO_DIR_UP : 'up',
    GPIO_DIR_DOWN : 'down',
    GPIO_EVENT_CHANGE : "change",
    GPIO_PULL_UP : 'rising',
    GPIO_PULL_DOWN : 'falling',

    ESCPOS_TYPE_USB : 1,
    ESCPOS_TYPE_NETWORK : 2,
    ESCPOS_TYPE_SERIAL : 3,
    ESCPOS_TYPE_BLUETOOTH : 4,

    ENCRYPTION_ENGINE_JWT : "JWT",
    ENCRYPTION_ENGINE_CRYPTO : "CRYPTO",

    ALGORITHM_AES_256_GCM : 'aes-256-gcm',
    ALGORITHM_AES_192_GCM : 'aes-192-gcm',
    ALGORITHM_AES_128_GCM : 'aes-128-gcm',

    SICEPAT_EXPEDITION_DEVELOPMENT : 'http://apitrek.sicepat.com/',
    SICEPAT_EXPEDITION_PRODUCTION : 'http://apitrek.sicepat.com/',
    SICEPAT_EXPEDITION_LOCATION_ORIGIN : 'origin',
    SICEPAT_EXPEDITION_LOCATION_DESTINATION : 'destination'
}

export default Options;