import merge from 'lodash.merge';

import en from './en.js';

const overrides = {

  accessory: {
    batteryLevel: 'Pin của %s còn %d%', // accessory name, number
    batteryLow: 'Pin của %s yếu', // accessory name
    batteryNotLow: 'Pin của %s bình thường', // accessory name
    missingRequired: '%s thiếu biến cấu hình bắt buộc %s', // accessory name, variable name
    statusActive: '%s hiện đã khả dụng', // accessory name
    statusInactive: '%s không khả dụng', // accessory name
  },

  characteristic: {
    badValue: '%s yêu cầu giá trị số cho %s nhưng nhận được %s', // accessory name, characteristic name, value
    outOfRange: '%s đang cố đặt %s thành %s, vượt ngoài phạm vi cho phép. Đang đặt về %s.', // accessory name, characteristic name, number, number
    updated: '%s đã cập nhật %s với giá trị %s', // accessory name, characteristic name, value
  },

  climate: {
    badTemperatureValue: '%s yêu cầu giá trị số cho nhiệt độ nhưng nhận được %s', // accessory name, value
    coolingThreshold: 'Ngưỡng làm mát của %s là %d°%s', // accessory name, number, units
    coolingThresholdFuture: 'Đang đặt ngưỡng làm mát của %s thành %d°%s…', // accessory name, number, units
    heatingThreshold: 'Ngưỡng sưởi của %s là %d°%s', // accessory name, number, units
    heatingThresholdFuture: 'Đang đặt ngưỡng sưởi của %s thành %d°%s…', // accessory name, number, units
    humidityUpdate: 'Độ ẩm của %s là %d%%', // accessory name, number
    temperatureUpdate: 'Nhiệt độ của %s là %d°%s', // accessory name, number, units
  },

  config: {
    continue: 'Tiếp tục %s', // arrow symbol
    required: 'Các trường bắt buộc được đánh dấu bằng dấu hoa thị (*)',
    support: 'Xem tài liệu và hỗ trợ tại %s', // link
    thankYou: 'Cảm ơn bạn đã cài đặt homebridge-easy-mqtt',

    description: {
      broker: 'Nếu không khai báo, mặc định là mqtt://127.0.0.1:1883/',
      options: 'Kết hợp các tùy chọn client hoặc publish bổ sung dưới dạng JSON hợp lệ',
      topics: 'Hỗ trợ JSONPath với cú pháp dấu chấm, ví dụ: "my/topic$.path.to.value"',
      values: 'Dùng cho cả get và set (publish), khi thích hợp',
      verbose: 'Nếu bật, sẽ ghi thêm thông tin MQTT phục vụ gỡ lỗi.',
    },

    enumNames: {
      airPurifier: 'Máy lọc không khí',
      airQualitySensor: 'Cảm biến chất lượng không khí',
      carbonDioxideSensor: 'Cảm biến CO2',
      carbonMonoxideSensor: 'Cảm biến CO',
      celsius: '°C',
      contactSensor: 'Cảm biến tiếp xúc',
      fahrenheit: '°F',
      fanv2: 'Quạt (v2)',
      garageDoorOpener: 'Cửa ga-ra',
      heaterCooler: 'Máy sưởi / Làm mát',
      humiditySensor: 'Cảm biến độ ẩm',
      leakSensor: 'Cảm biến rò rỉ',
      lightbulb: 'Bóng đèn',
      lightSensor: 'Cảm biến ánh sáng',
      lockMechanism: 'Cơ cấu khóa',
      motionSensor: 'Cảm biến chuyển động',
      occupancySensor: 'Cảm biến hiện diện',
      outlet: 'Ổ cắm',
      securitySystem: 'Hệ thống an ninh',
      smokeSensor: 'Cảm biến khói',
      switch: 'Công tắc',
      temperatureSensor: 'Cảm biến nhiệt độ',
      thermostat: 'Nhiệt kế điều chỉnh',
      valve: 'Van',
	  valveGeneric: 'Chung',
      valveIrrigation: 'Tưới nước',
      valveShower: 'Vòi sen tắm',
      valveFaucet: 'Vòi nước',
      windowCovering: 'Rèm cửa sổ',
    },

    title: {
      accessory: 'Thiết bị',
      broker: 'Máy chủ MQTT',
      disableLogging: 'Tắt ghi nhật ký',
      group: 'Nhóm',
      name: 'Tên',
      options: 'Tùy chọn',
      password: 'Mật khẩu',
      resetOnRestart: 'Đặt lại khi khởi động',
      sourceUnits: 'Đơn vị nguồn',
      topicGetActive: 'Lấy trạng thái hoạt động*',
      topicGetAirQuality: 'Lấy chất lượng không khí*',
      topicGetBatteryLevel: 'Lấy mức pin',
      topicGetBatteryLow: 'Lấy trạng thái pin yếu',
      topicGetBrightness: 'Lấy độ sáng',
      topicGetCarbonDioxideDetected: 'Lấy trạng thái CO2*',
      topicGetCarbonDioxideLevel: 'Lấy mức CO2',
      topicGetCarbonDioxidePeakLevel: 'Lấy mức CO2 cực đại',
      topicGetCarbonMonoxideDetected: 'Lấy trạng thái CO*',
      topicGetCarbonMonoxideLevel: 'Lấy mức CO',
      topicGetCarbonMonoxidePeakLevel: 'Lấy mức CO cực đại',
      topicGetColorTemperature: 'Lấy nhiệt độ màu',
      topicGetContactSensorState: 'Lấy trạng thái tiếp xúc*',
      topicGetCoolingThresholdTemperature: 'Lấy ngưỡng làm mát',
      topicGetCurrentAmbientLightLevel: 'Lấy mức ánh sáng hiện tại*',
      topicGetCurrentDoorState: 'Lấy trạng thái cửa hiện tại*',
      topicGetCurrentFanState: 'Lấy trạng thái quạt hiện tại',
      topicGetCurrentHeaterCoolerState: 'Lấy trạng thái hiện tại*',
      topicGetCurrentHeatingCoolingState: 'Lấy trạng thái hiện tại*',
      topicGetCurrentHorizontalTiltAngle: 'Lấy góc ngang',
      topicGetCurrentPurifierState: 'Lấy trạng thái máy lọc hiện tại*',
      topicGetCurrentLockState: 'Lấy trạng thái khoá hiện tại*',
      topicGetCurrentLockStateOptional: 'Lấy trạng thái khóa hiện tại',
      topicGetCurrentPosition: 'Lấy vị trí hiện tại*',
      topicGetCurrentRelativeHumidity: 'Lấy độ ẩm hiện tại*',
      topicGetCurrentRelativeHumidityOptional: 'Lấy độ ẩm hiện tại',
      topicGetCurrentSecurityState: 'Lấy trạng thái an ninh hiện tại*',
      topicGetCurrentTemperature: 'Lấy nhiệt độ hiện tại*',
      topicGetCurrentVerticalTiltAngle: 'Lấy góc dọc',
      topicGetFilterChangeIndication: 'Báo thay bộ lọc',
      topicGetFilterLifeLevel: 'Tuổi thị bộ lọc còn lại',
      topicGetHeatingThresholdTemperature: 'Lấy ngưỡng sưởi',
      topicGetHue: 'Lấy sắc độ',
      topicGetLeakDetected: 'Lấy trạng thái rò rỉ*',
      topicGetLockPhysicalControls: 'Lấy trạng thái khóa điều khiển',
      topicGetMotionDetected: 'Lấy trạng thái chuyển động*',
      topicGetNitrogenDioxideDensity: 'Lấy nồng độ NO2',
      topicGetObstructionDetected: 'Lấy trạng thái cản trở*',
      topicGetObstructionDetectedOptional: 'Lấy trạng thái cản trở',
      topicGetOccupancyDetected: 'Lấy trạng thái hiện diện*',
      topicGetOn: 'Lấy trạng thái bật/tắt*',
      topicGetOutletInUse: 'Lấy trạng thái sử dụng',
      topicGetOzoneDensity: 'Lấy nồng độ Ozone',
      topicGetPM10Density: 'Lấy PM10',
      topicGetPM2_5Density: 'Lấy PM2.5',
      topicGetPositionState: 'Lấy trạng thái vị trí*',
      topicGetRotationDirection: 'Lấy hướng quay',
      topicGetRotationSpeed: 'Lấy tốc độ quay',
      topicGetSaturation: 'Lấy độ bão hòa',
      topicGetSmokeDetected: 'Lấy trạng thái khói*',
      topicGetSwingMode: 'Lấy chế độ lắc',
      topicGetStatusActive: 'Lấy trạng thái khả dụng',
      topicGetStatusFault: 'Lấy lỗi',
      topicGetStatusTampered: 'Lấy trạng thái bị can thiệp',
      topicGetSulphurDioxideDensity: 'Lấy nồng độ SO2',
      topicGetTargetDoorState: 'Lấy trạng thái cửa mục tiêu*',
      topicGetTargetFanState: 'Lấy trạng thái quạt mục tiêu',
      topicGetTargetHeaterCoolerState: 'Lấy trạng thái mục tiêu*',
      topicGetTargetHeatingCoolingState: 'Lấy ctrạng thái mục tiêu*',
      topicGetTargetHorizontalTiltAngle: 'Lấy góc ngang mục tiêu',
      topicGetTargetPosition: 'Lấy vị trí mục tiêu*',
      topicGetTargetPurifierState: 'Lấy trạng thái máy lọc mục tiêu*',
      topicGetTargetLockState: 'Lấy trạng thái khoá mục tiêu*',
      topicGetTargetLockStateOptional: 'Lấy trạng thái khóa mục tiêu',
      topicGetTargetRelativeHumidity: 'Lấy độ ẩm mục tiêu',
      topicGetTargetSecurityState: 'Lấy trạng thái an ninh mục tiêu*',
      topicGetTargetTemperature: 'Lấy nhiệt độ mục tiêu*',
      topicGetTargetVerticalTiltAngle: 'Lấy góc dọc mục tiêu',
      topicGetValveActive: 'Lấy trạng thái hoạt động*',
      topicGetValveInUse: 'Lấy trạng thái sử dụng*',
      topicGetValveIsConfigured: 'Lấy trạng thái đã cấu hình',
      topicGetValveRemainingDuration: 'Lấy thời lượng còn lại',
      topicGetValveSetDuration: 'Lấy thời lượng',
      topicGetVOCDensity: 'Lấy VOC',
      topicResetFilterIndication: 'Đặt lại bộ lọc',
      topicSetActive: 'Đặt trạng thái hoạt động*',
      topicSetBrightness: 'Đặt độ sáng',
      topicSetColorTemperature: 'Đặt nhiệt độ màu',
      topicSetCoolingThresholdTemperature: 'Đặt ngưỡng làm mát',
      topicSetHeatingThresholdTemperature: 'Đặt ngưỡng sưởi',
      topicSetHoldPosition: 'Đặt vị trí giữ',
      topicSetHue: 'Đặt sắc độ',
      topicSetLockPhysicalControls: 'Đặt khóa điều khiển',
      topicSetOn: 'Đặt trạng thái Bật/Tắt*',
      topicSetRotationDirection: 'Đặt hướng quay',
      topicSetRotationSpeed: 'Đặt tốc độ quay',
      topicSetSaturation: 'Đặt độ bão hòa',
      topicSetSwingMode: 'Đặt chế độ lắc',
      topicSetTargetDoorState: 'Đặt trạng thái cửa mục tiêu*',
      topicSetTargetFanState: 'Đặt chế độ mục tiêu',
      topicSetTargetHeaterCoolerState: 'Đặt chế độ mục tiêu*',
      topicSetTargetHeatingCoolingState: 'Đặt chế độ mục tiêu*',
      topicSetTargetHorizontalTiltAngle: 'Đặt góc ngang mục tiêu',
      topicSetTargetPosition: 'Đặt vị trí mục tiêu*',
      topicSetTargetPurifierState: 'Đặt chế độ mục tiêu*',
      topicSetTargetLockState: 'Đặt trạng thái mục tiêu*',
      topicSetTargetLockStateOptional: 'Đặt trạng thái khóa mục tiêu',
      topicSetTargetRelativeHumidity: 'Đặt độ ẩm mục tiêu',
      topicSetTargetSecurityState: 'Đặt trạng thái mục tiêu*',
      topicSetTargetTemperature: 'Đặt nhiệt độ mục tiêu*',
      topicSetTargetVerticalTiltAngle: 'Đặt góc dọc mục tiêu',
      topicSetValveActive: 'Đặt trạng thái hoạt động*',
      topicSetValveIsConfigured: 'Đặt trạng thái cấu hình',
      topicSetValveSetDuration: 'Đặt thời lượng',
      topics: 'Chủ đề',
      type: 'Loại',
      username: 'Tên người dùng',
      valveType: 'Loại van',
      valueActive: 'Đang hoạt động*',
      valueAlarmTriggered: 'Báo động',
      valueAQExcellent: 'Chất lượng không khí: Xuất sắc',
      valueAQFair: 'Chất lượng không khí: Trung bình',
      valueAQGood: 'Chất lượng không khí: Tốt',
      valueAQInferior: 'Chất lượng không khí: Kém',
      valueAQPoor: 'Chất lượng không khí: Xấu',
      valueAQUnknown: 'Chất lượng không khí: Không xác định',
      valueArmAway: 'Kích hoạt khi đi vắng',
      valueArmNight: 'Kích hoạt ban đêm',
      valueArmStay: 'Kích hoạt khi ở nhà',
      valueBatteryLow: 'Pin yếu',
      valueCarbonDioxideDetected: 'Phát hiện CO2*',
      valueCarbonMonoxideDetected: 'Phát hiện CO*',
      valueConfigured: 'Đã cấu hình',
      valueContactDetected: 'Phát hiện tiếp xúc*',
      valueControlLock: 'Điều khiển đã khóa',
      valueControlUnlock: 'Điều khiển đã mở khóa',
      valueDirectionClockwise: 'Thuận chiều kim đồng hồ',
      valueDirectionCounterClockwise: 'Ngược chiều kim đồng hồ',
      valueDisarm: 'Ngắt kích hoạt',
      valueDoorObstructed: 'Bị cản trở',
      valueDoorStateClosed: 'Đóng',
      valueDoorStateClosing: 'Đang đóng',
      valueDoorStateOpen: 'Mở',
      valueDoorStateOpening: 'Đang mở',
      valueDoorStateStopped: 'Đã dừng',
      valueFault: 'Lỗi',
      valueFilterChange: 'Bộ lọc bẩn',
      valueFilterReset: 'Đặt lại bộ lọc',
      valueInactive: 'Không hoạt động*',
      valueInUse: 'Đang sử dụng*',
      valueLeakDetected: 'Phát hiện rò rỉ*',
      valueLockStateJammed: 'Kẹt',
      valueLockStateSecured: 'Đã khóa*',
      valueLockStateSecuredOptional: 'Đã khóa',
      valueLockStateUnsecured: 'Đã mở khóa*',
      valueLockStateUnsecuredOptional: 'Đã mở khóa',
      valueModeAuto: 'Tự động',
      valueModeBlowing: 'Đang thổi',
      valueModeCool: 'Làm mát',
      valueModeHeat: 'Sưởi',
      valueModeIdle: 'Chờ',
      valueModeInactive: 'Không hoạt động',
      valueModeManual: 'Thủ công',
      valueModeOff: 'Tắt',
      valueModePurifying: 'Đang lọc',
      valueMotionDetected: 'Phát hiện chuyển động*',
      valueNotConfigured: 'Chưa cấu hình',
      valueOccupancyDetected: 'Phát hiện hiện diện*',
      valueOff: 'Tắt*',
      valueOn: 'Bật*',
      valueOutletInUse: 'Đang sử dụng',
      valueOutletNotInUse: 'Không sử dụng',
      valuePositionHold: 'Giữ',
      valuePositionDecreasing: 'Đang giảm',
      valuePositionIncreasing: 'Đang tăng',
      valuePositionObstructed: 'Bị cản trở',
      valuePositionResume: 'Tiếp tục',
      valuePositionStopped: 'Đã dừng',
      valueSmokeDetected: 'Phát hiện khói*',
      valueStateActive: 'Đang hoạt động*',
      valueStateInactive: 'Không hoạt động*',
      valueStatusActive: 'Có sẵn / Kết nối được',
      valueSwingEnabled: 'Bật chế độ lắc',
      valueSwingDisabled: 'Tắt chế độ lắc',
      valueTampered: 'Bị can thiệp',
      values: 'Giá trị',
      verbose: 'Ghi log bổ sung',
    },
  },

  error: {
    hasFault: '%s gặp sự cố', // accessory name
    isTampered: '%s đã bị can thiệp', // accessory name
    noFault: '%s không có sự cố', // accessory name
    notTampered: 'Trạng thái bị can thiệp của %s đã được đặt lại', // accessory name
  },

  fanv2: {
    badValue: '%s thiếu giá trị cho trạng thái quạt %s', // accessory name, value
    clockwise: '%s đang quay thuận chiều kim đồng hồ', // accessory name
    counterClockwise: '%s đang quay ngược chiều kim đồng hồ', // accessory name
    noCurrentStateValues: '%s phải có ít nhất một trạng thái hiện tại (Inactive, Idle, Blowing)', // accessory name
    noTargetStateValues: '%s phải có ít nhất một trạng thái mục tiêu (Auto, Manual)', // accessory name
    setDirectionClockwise: 'Đang đặt %s quay thuận chiều kim đồng hồ…', // accessory name
    setDirectionCounterClockwise: 'Đang đặt %s quay ngược chiều kim đồng hồ…', // accessory name
    stateAuto: 'Đang đặt %s thành tự động…', // accessory name
    stateBlowing: '%s đang thổi gió', // accessory name
    stateIdle: '%s đang chờ', // accessory name
    stateInactive: '%s không hoạt động', // accessory name
    stateManual: 'Đang đặt %s thành thủ công…', // accessory name
    stateUnknown: 'Không xác định được trạng thái của %s', // accessory name
    unknownValue: '%s không xác định được trạng thái quạt từ giá trị %s. Bỏ qua…', // accessory name, value
  },

  filter: {
    change: '%s cần bảo dưỡng bộ lọc', // accessory name
    level: 'Bộ lọc %s còn %d%', // accessory name, number
    ok: 'Bộ lọc %s bình thường', // accessory name
    reset: 'Đang đặt lại bộ lọc cho %s…', // accessory name
  },

  garage: {
    badValue: '%s thiếu giá trị cho trạng thái cửa %s', // accessory name, value
    noCurrentStateValues: '%s phải có ít nhất một trạng thái hiện tại (Open, Closed, Opening, Closing, Stopped)', // accessory name
    noTargetStateValues: '%s phải có ít nhất một trạng thái mục tiêu (Open, Closed)', // accessory name
    obstructed: '%s bị cản trở', // accessory name
    stateClosed: '%s đã đóng', // accessory name
    stateClosedFuture: 'Đang đóng %s…',
    stateClosing: '%s đang đóng', // accessory name
    stateOpen: '%s đang mở', // accessory name
    stateOpenFuture: 'Đang mở %s…', // accessory name
    stateOpening: '%s đang mở', // accessory name
    stateStopped: '%s đã dừng', // accessory name
    stateUnknown: 'Không xác định được trạng thái của %s', // accessory name
    unknownValue: '%s không xác định được trạng thái cửa từ giá trị %s. Bỏ qua…', // accessory name, value
    unobstructed: '%s không bị cản trở', // accessory name
  },

  heaterCooler: {
    active: '%s đang hoạt động', // accessory name
    activeSet: 'Đang đặt %s thành hoạt động…', // accessory name
    badValue: '%s thiếu giá trị cho trạng thái sưởi/làm mát %s', // accessory name, value
    controlsLocked: 'Điều khiển của %s đã bị khóa', // accessory name
    controlsLockFuture: 'Đang đặt điều khiển của %s thành khóa…', // accessory name
    controlsUnLocked: 'Điều khiển của %s đã được mở khóa', // accessory name
    controlsUnlockFuture: 'Đang đặt điều khiển của %s thành mở khóa…', // accessory name
    inactiveSet: 'Đang đặt %s thành không hoạt động…', // accessory name
    noStateValues: '%s phải có ít nhất một trạng thái (Không hoạt động, Chờ, Sưởi, Làm mát)', // accessory name
    notActive: '%s không hoạt động', // accessory name
    rotationUpdate: 'Tốc độ quay của %s là %d%', // accessory name, number
    rotationSet: 'Đang đặt tốc độ quay của %s thành %d%…', // accessory name, number
    swingDisabled: 'Chế độ lắc của %s đã tắt', // accessory name
    swingDisabledFuture: 'Đang tắt chế độ lắc của %s…', // accessory name
    swingEnabled: 'Chế độ lắc của %s đã bật', // accessory name
    swingEnabledFuture: 'Đang bật chế độ lắc của %s…', // accessory name
    stateAuto: 'Đang đặt %s thành tự động…', // accessory name
    stateCool: 'Đang đặt %s sang chế độ làm mát…', // accessory name
    stateCooling: '%s đang làm mát', // accessory name
    stateHeat: 'Đang đặt %s sang chế độ sưởi…', // accessory name
    stateHeating: '%s đang sưởi', // accessory name
    stateIdle: '%s đang chờ', // accessory name
    stateInactive: '%s không hoạt động', // accessory name
    stateUnknown: 'Không xác định được trạng thái của %s', // accessory name
    unknownValue: '%s không xác định được trạng thái sưởi/làm mát từ giá trị %s. Đang bỏ qua…', // accessory name, value
  },

  lightbulb: {
    brightness: 'Độ sáng của %s là %d%', // accessory name, number
    brightnessFuture: 'Đang đặt độ sáng của %s thành %d%…', // accessory name, number
    colorTemperature: 'Nhiệt độ màu của %s là %dM', // accessory name, number
    colorTemperatureFuture: 'Đang đặt nhiệt độ màu của %s thành %dM…', // accessory name, number
    hue: 'Sắc độ của %s là %d°', // accessory name, number
    hueFuture: 'Đang đặt sắc độ của %s thành %d°…', // accessory name, number
    saturation: 'Độ bão hòa của %s là %d%', // accessory name, number
    saturationFuture: 'Đang đặt độ bão hòa của %s thành %d%…', // accessory name, number
  },

  lock: {
    badValue: '%s không xác định được trạng thái khóa từ %s', // accessory name, value
    stateJammed: '%s bị kẹt', // accessory name
    stateSecured: '%s đã khóa', // accessory name
    stateSecuredFuture: 'Đang khóa %s…', // accessory name
    stateUnsecured: '%s đã mở khóa', // accessory name
    stateUnsecuredFuture: 'Đang mở khóa %s…', // accessory name
    stateUnknown: 'Không xác định được trạng thái của %s', // accessory name
  },

  mqttClient: {
    badOptions: 'Tùy chọn bổ sung cho %s phải là JSON hợp lệ', // accessory name
    badMessages: 'Tin nhắn onConnect phải là mảng chứa topic/message objects',
    connected: 'Đã kết nối tới %s và đang chờ cập nhật…', // host
    connectionClosed: 'Đã đóng kết nối tới %s', // host
    error: 'Lỗi client trên %s', // host
    new: '%s tạo một client mới với id %s', // accessory name, uuid
    noListeners: 'Không có listener trên %s cho topic %s', // host, topic
    notConnected: 'Client chưa kết nối tới %s', // host
    parseFailed: 'Không thể phân tích tin nhắn trên %s', // host
    publish: 'Đang publish tới %s', // host
    reuse: '%s đang tái sử dụng client hiện có với id %s', // accessory name, uuid
    receivedMessage: 'Nhận tin nhắn trên %s với topic %s', // host, topic
    reconnectMinutes: 'Sẽ thử kết nối lại %s trong %s phút…', // host, number
    reconnectSeconds: 'Sẽ thử kết nối lại %s trong %s giây…', // host, number
  },

  onOff: {
    stateOff: '%s đang tắt', // accessory name
    stateOffFuture: 'Đang tắt %s…', // accessory name
    stateOn: '%s đang bật', // accessory name
    stateOnFuture: 'Đang bật %s…', // accessory name
    unknownValue: '%s không xác định được trạng thái bật/tắt từ %s. Đang bỏ qua…', // accessory name, value
  },

  outlet: {
    badValue: '%s không lấy được trạng thái sử dụng cho %s', // accessory name, value
    inUse: '%s đang sử dụng', // accessory name
    notInUse: '%s không sử dụng', // accessory name
  },

  position: {

    blind: {
      currentHorizontal: 'Góc ngang hiện tại của %s là %d°', // accessory name, number
      currentVertical: 'Góc dọc hiện tại của %s là %d°', // accessory name, number
      targetHorizontal: 'Góc ngang mục tiêu của %s là %d°', // accessory name, number
      targetHorizontalSet: 'Đang đặt góc ngang mục tiêu của %s thành %d°…', // accessory name, number
      targetVertical: 'Góc dọc mục tiêu của %s là %d°', // accessory name, number
      targetVerticalSet: 'Đang đặt góc dọc mục tiêu của %s thành %d°…', // accessory name, number
    },

    current: 'Vị trí hiện tại của %s là %d%', // accessory name, number
    hold: 'Đang đặt vị trí của %s thành giữ…', // accessory name
    noPositionValues: '%s phải có ít nhất một trạng thái vị trí (Đang giảm, Đang tăng, Dừng)', // accessory name
    obstructed: '%s bị cản trở', // accessory name
    resume: 'Đang đặt vị trí của %s thành tiếp tục…', // accessory name
    stateDecreasing: 'Vị trí của %s đang giảm', // accessory name
    stateIncreasing: 'Vị trí của %s đang tăng', // accessory name
    stateStopped: 'Vị trí của %s đã dừng', // accessory name
    stateUnknown: 'Không xác định được trạng thái vị trí của %s', // accessory name
    target: 'Vị trí mục tiêu của %s là %d%', // accessory name, number
    targetSet: 'Đang đặt vị trí mục tiêu của %s thành %d%…', // accessory name, number
    unknownValue: '%s không xác định được trạng thái vị trí từ giá trị %s. Đang bỏ qua…', // accessory name, value
    unobstructed: '%s không bị cản trở', // accessory name
  },

  purifier: {
    badValue: '%s thiếu giá trị cho trạng thái máy lọc không khí %s', // accessory name, value
    noCurrentStateValues: '%s phải có ít nhất một trạng thái hiện tại (Không hoạt động, Chờ, Đang lọc)', // accessory name
    noTargetStateValues: '%s phải có ít nhất một trạng thái mục tiêu (Tự động, Thủ công)', // accessory name
    stateAuto: 'Đang đặt %s thành tự động…', // accessory name
    stateIdle: '%s đang chờ', // accessory name
    stateInactive: '%s không hoạt động', // accessory name
    stateManual: 'Đang đặt %s thành thủ công…', // accessory name
    statePurifying: '%s đang lọc', // accessory name
    stateUnknown: 'Không xác định được trạng thái của %s', // accessory name
    unknownValue: '%s không xác định được trạng thái máy lọc không khí từ giá trị %s. Đang bỏ qua…', // accessory name, value
  },

  security: {
    badValue: '%s thiếu giá trị cho trạng thái an ninh %s', // accessory name, value
    noStateValues: '%s phải có ít nhất một trạng thái (Đi vắng, Tắt, etc.)', // accessory name
    stateAway: '%s đang bật chế độ đi vắng', // accessory name
    stateAwayFuture: 'Đang bật chế độ đi vắng cho %s…', // accessory name
    stateDisarmed: '%s đã tắt an ninh', // accessory name
    stateDisarmFuture: 'Đang tắt an ninh %s…', // accessory name
    stateNight: '%s đang bật chế độ ban đêm', // accessory name
    stateNightFuture: 'Đang bật chế độ ban đêm cho %s…', // accessory name
    stateStay: '%s đang bật chế độ ở nhà', // accessory name
    stateStayFuture: 'Đang bật chế độ ở nhà cho %s…', // accessory name
    stateTriggered: 'Báo động của %s đã kích hoạt', // accessory name
    stateUnknown: 'Không xác định được trạng thái của %s', // accessory name
    unknownValue: '%s không xác định được trạng thái an ninh từ giá trị %s. Đang bỏ qua…', // accessory name, value
  },

  sensor: {

    air: {
      noStateValues: '%s phải có ít nhất một trạng thái chất lượng không khí (Tuyệt vời, Tốt, Bình thường, Kém, Xấu)', // accessory name
      densityNitrogen: 'Nồng độ nitơ của %s là %d µg/m³', // accessory name, number
      densityOzone: 'Nồng độ ozone của %s là %d µg/m³', // accessory name, number
      densityPM10: 'Nồng độ PM10 của %s là %d µg/m³', // accessory name, number
      densityPM2_5: 'Nồng độ PM2.5 của %s là %d µg/m³', // accessory name, number
      densitySulphur: 'Nồng độ SO2 của %s là %d µg/m³', // accessory name, number
      densityVOC: 'Nồng độ VOC của %s là %d µg/m³', // accessory name, number
      qualityExcellent: 'Chất lượng không khí của %s: Tuyệt vời', // accessory name
      qualityFair: 'Chất lượng không khí của %s: Bình thường', // accessory name
      qualityGood: 'Chất lượng không khí của %s: Tốt', // accessory name
      qualityInferior: 'Chất lượng không khí của %s: Kém', // accessory name
      qualityPoor: 'Chất lượng không khí của %s: Xấu', // accessory name
      qualityUnknown: 'Chất lượng không khí của %s: Không xác định', // accessory name
      unknownValue: '%s không xác định được chất lượng không khí từ giá trị %s. Đang bỏ qua…', // accessory name, value
    },

    carbonDioxide: {
      active: '%s phát hiện CO2', // accessory name
      inactive: '%s ngừng phát hiện CO2', // accessory name
      level: 'Nồng độ CO2 của %s là %d', // accessory name, number
      peakLevel: 'Nồng độ CO2 cực đại của %s là %d', // accessory name, number
    },

    carbonMonoxide: {
      active: '%s phát hiện CO', // accessory name
      inactive: '%s ngừng phát hiện CO', // accessory name
      level: 'Nồng độ CO của %s là %d',  // accessory name, number
      peakLevel: 'Nồng độ CO cực đại của %s là %d', // accessory name, number
    },

    contact: {
      active: '%s phát hiện tiếp xúc', // accessory name
      inactive: '%s ngừng phát hiện tiếp xúc', // accessory name
    },

    leak: {
      active: '%s phát hiện rò rỉ', // accessory name
      inactive: '%s ngừng phát hiện rò rỉ', // accessory name
    },

    light: {
      level: 'Mức ánh sáng hiện tại của %s là %d lx', // accessory name, number
    },

    motion: {
      active: '%s phát hiện chuyển động', // accessory name
      inactive: '%s ngừng phát hiện chuyển động', // accessory name
    },

    occupancy: {
      active: '%s phát hiện có người', // accessory name
      inactive: '%s không còn phát hiện người', // accessory name
    },

    smoke: {
      active: '%s phát hiện khói', // accessory name
      inactive: '%s không còn phát hiện khói', // accessory name
    },
  },

  startup: {
    complete: '✓ Cài đặt hoàn tất',
    newAccessory: 'Đang thêm %s', // accessory name
    removeAccessory: 'Đang gỡ %s', // accessory name
    restoringAccessory: 'Đang khôi phục %s', // accessory name
    unsupportedType: 'Loại thiết bị không được hỗ trợ: %s', // accessory type
    welcome: [
      'Hãy ★ plugin này trên GitHub nếu bạn thấy hữu ích! https://github.com/mpatfield/homebridge-easy-mqtt',
      'Bạn có muốn tài trợ cho plugin này không? https://github.com/sponsors/mpatfield',
      'Muốn thấy plugin này bằng ngôn ngữ của bạn? Hãy ghé https://github.com/mpatfield/homebridge-easy-mqtt/issues/4',
    ],
  },

  thermostat: {
    badValue: '%s thiếu giá trị cho trạng thái nhiệt kế %s', // accessory name, value
    humidityFuture: 'Đang đặt độ ẩm của %s thành %d%…', // accessory name, number
    noStateValues: '%s phải có ít nhất một trạng thái (Tắt, Sưởi, Làm mát)', // accessory name
    stateAutoFuture: 'Đang đặt %s thành tự động…', // accessory name
    stateCool: '%s đang ở chế độ làm mát', // accessory name
    stateCoolFuture: 'Đang đặt %s sang chế độ làm mát…', // accessory name
    stateHeat: '%s đang ở chế độ sưởi', // accessory name
    stateHeatFuture: 'Đang đặt %s sang chế độ sưởi…', // accessory name
    stateOff: '%s đang tắt', // accessory name
    stateOffFuture: 'Đang tắt %s…', // accessory name
    stateUnknown: 'Không xác định được trạng thái của %s', // accessory name
    temperatureTarget: 'Nhiệt độ mục tiêu của %s là %d°%s', // accessory name, number, units
    temperatureTargetFuture: 'Đang đặt nhiệt độ mục tiêu của %s thành %d°%s…', // accessory name, number, units
    unknownValue: '%s không xác định được trạng thái nhiệt kế từ giá trị %s. Đang bỏ qua…', // accessory name, value
  },

  valve: {
    active: '%s đang hoạt động', // accessory name
    activeSet: 'Đang đặt %s thành hoạt động…', // accessory name
    badValveType: '%s có kiểu van không hợp lệ %s. Phải là một trong %s.', // accessory name, value, list of values
    configured: '%s đã được cấu hình', // accessory name
    configuredFuture: 'Đang đặt %s thành cấu hình…', // accessory name
    durationRemaining: '%s còn %d giây', // accessory name
    inactive: '%s không hoạt động', // accessory name
    inactiveSet: 'Đang đặt %s thành không hoạt động…', // accessory name
    inUse: '%s đang được sử dụng', // accessory name
    notConfigured: '%s chưa được cấu hình', // accessory name
    notConfiguredFuture: 'Đang đặt %s thành chưa cấu hình…', // accessory name
    notInUse: '%s không được sử dụng', // accessory name
    setDuration: 'Thời lượng của %s là %d giây', // accessory name
    setDurationFuture: '%s sẽ chạy trong %d giây', // accessory name
  },
};

const vi = merge({}, en, overrides);

export default vi;